import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./components/Avatar";
import { motion, AnimatePresence } from "framer-motion";



function App() {
  const [accounts, setAccounts] = useState();
  const navigate = useNavigate();
  const [editAccountPrompt, setEditAccountPrompt] = useState(false);

  function logoutOfAccount(acc) {
    setEditAccountPrompt(false);

    let accs = JSON.parse(localStorage.getItem("accounts"));
    accs.splice(accs.indexOf(acc), 1);
    localStorage.setItem("accounts", JSON.stringify(accs));
    if (accs.length === 0) {
      return navigate("/login");
    } else {
      accs = accounts
      delete accs[acc];
      setAccounts(accs);
    }
  }

  useEffect(() => {
    async function myfunction() {
      let accounts = JSON.parse(localStorage.getItem("accounts"));
      if (accounts === null || accounts.length === 0) {
        console.log("No accounts found");
        navigate("/login");
        return;
      }

      let accs = {};
      let validAccounts = 0;


      for (let i = 0; i < accounts.length; i++) {
        await fetch(`http://192.168.1.224:8172/profile-data?code=${accounts[i]}`)
          .then(response => response.json())
          .then(data => {
            if (data.valid === true) {
              validAccounts++;
              accs[accounts[i]] = data;
            }
          })
          .catch(err => {
            console.log(err);

          });
      }
      setAccounts(accs);
      if (validAccounts === 0) {
        navigate("/login");
        return () => {
          console.log("No valid accounts found");
          setAccounts(null);
        }
      }
    }
    myfunction();
    console.log("useEffect");
  }, []);

  if (!accounts) {
    return null;
  }

  return (
    <motion.div
    key="content"
          initial={{ x: -1000, y: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 1000 }}
          transition={{ duration: 0.5 }}>
    <div className="content">
      <h3>Select an account</h3>
      <div className="seperator"/>
      <div className="overflow_hidden">
        <motion.div className="accounts"
          animate={{
            marginRight: editAccountPrompt ? "10em" : "0em"
          }}
          transition={{
            duration: 0.4,
          }}>
          <AnimatePresence key="WHOLE DIV">
          {
            // loop through accounts, but with a loop that will update when the accounts state changes. Also anaimate the height of the accounts when they are added using framer motion's AnimatePresence
            Object.keys(accounts).map(account => {
              return (
                  <motion.div className="account_and_logout_button" key={account + "LOGOUT"}
                    initial={{
                      height: "0em"
                    }}
                    animate={{
                      height: "3.2em"
                    }}
                    exit={{
                      height: "0em",
                      opacity: 0
                    }}
                    transition={{type:"spring", duration: 0.1, velocity:3, damping:12, stiffness:80 }}>
                    {/* Set the className to a ternary statment that is account + last_element, where it will only add last element if it is the last element in the accounts object*/}
                    <div className={Object.keys(accounts).length === Object.keys(accounts).indexOf(account) + 1 ? "account last_element" : "account"}>
                      <img src={Avatar(accounts[account])} alt="avatar" className="avatar" />
                      <p>{accounts[account].username}#{accounts[account].discriminator}</p>
                      <img src="" alt="" />
                    </div>
                    <div className="logout">
                      <button onClick={() => logoutOfAccount(account)}>Logout</button>
                    </div>
                  </motion.div>
              );
            })
          }
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="edit" onClick={() => setEditAccountPrompt(!editAccountPrompt)}>
        <p>{editAccountPrompt ? "Cancel" : "Edit"}</p>
      </div>
      <div className="add_account" onClick={() => navigate("/login")}>
        <p>Add another account</p>
      </div>
    </div>
    <p className="soosBot">soosBot</p>
    </motion.div>
  )
}

export default App;

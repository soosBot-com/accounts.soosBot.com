import "../style/SelectAccount.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import PageAnimator from "../components/PageAnimation";
import { motion, AnimatePresence } from "framer-motion";

function SelectAccount() {
    const navigate = useRef(useNavigate());
    const [accounts, setAccounts] = useState(null);
    const [editAccountsPrompt, setEditAccountsPrompt] = useState(false);

    function logoutOutOfAccount(account) {
        setEditAccountsPrompt(false);
        let storedAccounts = JSON.parse(localStorage.getItem("accounts"));
        storedAccounts.splice(storedAccounts.indexOf(account), 1);
        localStorage.setItem("accounts", JSON.stringify(storedAccounts));

        // If the accounts array is empty, redirect to the login page
        if (storedAccounts.length === 0) {
            navigate.current("/login");
        }

        let accs = accounts.filter(acc => acc !== account);
        setAccounts(accs);
    }


    async function main() {
        let storedAccounts = JSON.parse(localStorage.getItem("accounts"));
        if (storedAccounts === null || storedAccounts.length === 0) {
            console.log("No accounts found");
            navigate.current("/login");
            return;
        }

        let validAccounts = {};


        for (let i = 0; i < storedAccounts.length; i++) {
            await fetch(`http://192.168.1.224:8172/profile-data?code=${storedAccounts[i]}`)
                .then(response => response.json())
                .then(data => {
                    if (data.valid === true) {
                        validAccounts[storedAccounts[i]] = data;
                    }
                })
                .catch(err => {
                    console.log(err);

                });
        }
        setAccounts(validAccounts);
        // Check if there are no valid accounts
        if (Object.keys(validAccounts).length === 0) {
            navigate.current("/login");
        }
    }


    useEffect(() => {
        main();
    }, []);

    if (accounts === null) {
        return null;
    }

    return (
        <>
            <PageAnimator>
                <div className="content">
                    <h3>Select an account</h3>
                    <div className="seperator" />
                    <div className="overflow_hidden">
                        <motion.div className="accounts"
                            animate={{
                                marginRight: editAccountsPrompt ? "10em" : "0em"
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
                                                transition={{ type: "spring", duration: 0.1, velocity: 3, damping: 12, stiffness: 80 }}>
                                                {/* Set the className to a ternary statment that is account + last_element, where it will only add last element if it is the last element in the accounts object*/}
                                                <div className={Object.keys(accounts).length === Object.keys(accounts).indexOf(account) + 1 ? "account last_element" : "account"}>
                                                    <img src={Avatar(accounts[account])} alt="avatar" className="avatar" />
                                                    <p>{accounts[account].username}#{accounts[account].discriminator}</p>
                                                    <img src="" alt="" />
                                                </div>
                                                <div className="logout">
                                                    <button onClick={() => logoutOutOfAccount(account)}>Logout</button>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                }
                            </AnimatePresence>
                        </motion.div>
                    </div>
                    <div className="edit" onClick={() => setEditAccountsPrompt(!editAccountsPrompt)}>
                        <p>{editAccountsPrompt ? "Cancel" : "Edit"}</p>
                    </div>
                    <div className="add_account" onClick={() => navigate.current("/login")}>
                        <p>Add another account</p>
                    </div>
                </div>
            </PageAnimator>
            <p className="soosBot">soosBot</p>
        </>
    );
}

export default SelectAccount;
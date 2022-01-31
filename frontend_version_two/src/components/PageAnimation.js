import { motion } from "framer-motion";

const animations = {
  initial: {opacity: 0, marginLeft: "-5em" },
  animate: {opacity: 1, marginLeft: "0em" },
  exit: {opacity: 0, marginLeft: "5em" },
};

const PageAnimation = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0. }}
    >
      {children}
    </motion.div>
  );
};

export default PageAnimation;
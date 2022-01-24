import { motion } from "framer-motion";

const animations = {
  initial: { opacity: 0, marginRight: "110em" },
  animate: { opacity: 1, marginRight: "0em" },
  exit: { opacity: 0, MarginRight: "110em" },
};

const PageAnimation = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
};

export default PageAnimation;
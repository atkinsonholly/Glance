import React, { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Flex flexDirection="column" minHeight="100vh" height="100%"   >
      <Navigation />
        {children}
      <Footer />
    </Flex>
  );
};

export default Layout;


import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";

const Navigation: React.FC = () => {

  return (
    <Flex
      as="nav"
      align="center"
      justify="center"
      wrap="wrap"
      height="60px"
      fontSize="18px"
      fontFamily="accent"
    >
      
      <Box >
          <Text fontFamily="alt" fontSize="18px" color="dark_yellow" >
              Glance
          </Text>
          </Box>
      
    
    </Flex>
  );
};

export default Navigation;

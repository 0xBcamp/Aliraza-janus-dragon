import Link from "next/link";
import React from "react";
import Navbar from "./navbar";
import { Container, Box, Text, Stack } from "@chakra-ui/layout";
import Image from "next/image";
import { Card } from "@chakra-ui/card";

const page = () => {
  return (
    <>
      <Navbar />
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        h="55vh"
      >
        {/* Title Side */}
        <Card
          bg="#a75af7"
          width="400px"
          height="400px"
          ml="20%"
          mt="20"
          padding="10"
          borderRadius="35"
          className="text-white text-center items-center justify-center"
        >
          <h1 className="text-white text-4xl md:text-6xl font-bold">
            ChainFusion
          </h1>
          <h1 className="text-white text-4xl md:text-4xl font-bold mt-4">
            Onboarding & Identity Management
          </h1>
          <p className="text-white mt-8 text-lg">
            Welcome to ChainFusion, your hub for identity management and
            decentralized finance. Explore a world of security, transparency,
            and financial freedom. Powered by Moon.
          </p>
        </Card>

        {/* Logo Side */}
        <Container width="400px" height="400px" mt="-10" mr="20%">
          <Image
            width="400"
            height="400"
            src="/chainfusion.png"
            alt="Your Logo"
            className=" z-20 absolute"
          />
          <svg
            viewBox="0 0 200 200"
            width="700"
            height="700"
            xmlns="http://www.w3.org/2000/svg"
            className="z-1 absolute"
          >
            <path
              fill="#c59efa"
              d="M23.8,-53C25.9,-39.9,19.3,-23.6,27.8,-14.3C36.3,-4.9,59.9,-2.4,70.4,6C80.9,14.5,78.2,29.1,67.3,34.3C56.4,39.6,37.3,35.5,24.7,30.2C12.1,24.8,6.1,18.2,-3.7,24.6C-13.4,30.9,-26.8,50.2,-33.2,52C-39.6,53.8,-39,38,-45.7,26.4C-52.5,14.8,-66.5,7.4,-73.6,-4.1C-80.7,-15.6,-80.8,-31.2,-70,-35.6C-59.1,-40.1,-37.3,-33.4,-23.8,-39.9C-10.3,-46.4,-5.1,-66.2,2.8,-71.1C10.8,-76,21.6,-66.1,23.8,-53Z"
              transform="translate(80 90)"
            />
          </svg>
        </Container>
      </Stack>

      <svg
        width="100%"
        height="100%"
        id="svg"
        viewBox="0 0 1440 490"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out delay-150"
      >
        <defs>
          <linearGradient id="gradient" x1="41%" y1="1%" x2="59%" y2="99%">
            <stop offset="5%" stop-color="#a75af7"></stop>
            <stop offset="95%" stop-color="#f24861"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,500 L 0,125 C 73.10133974579182,97.58467880453452 146.20267949158364,70.16935760906904 205,77 C 263.79732050841636,83.83064239093096 308.2906217794572,124.90724836825834 387,136 C 465.7093782205428,147.09275163174166 578.6348333905875,128.20164891789761 648,115 C 717.3651666094125,101.79835108210237 743.1700446581931,94.28615596015115 792,112 C 840.8299553418069,129.71384403984885 912.6849879766405,172.65372724149776 990,186 C 1067.3150120233595,199.34627275850224 1150.0900034352455,183.09893507385777 1226,168 C 1301.9099965647545,152.90106492614223 1370.9549982823773,138.9505324630711 1440,125 L 1440,500 L 0,500 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          fill-opacity="0.53"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="41%" y1="1%" x2="59%" y2="99%">
            <stop offset="5%" stop-color="#a75af7"></stop>
            <stop offset="95%" stop-color="#f24861"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,500 L 0,291 C 60.68223978014427,265.45757471659226 121.36447956028854,239.91514943318447 199,252 C 276.63552043971146,264.08485056681553 371.22432153899,313.79697698385434 442,318 C 512.77567846101,322.20302301614566 559.7382342837512,280.89694263139813 619,271 C 678.2617657162488,261.10305736860187 749.8227413260048,282.6152524905531 827,284 C 904.1772586739952,285.3847475094469 986.9708004122292,266.64204740638957 1049,266 C 1111.0291995877708,265.35795259361043 1152.2940570250773,282.81655788388866 1214,290 C 1275.7059429749227,297.18344211611134 1357.8529714874612,294.09172105805567 1440,291 L 1440,500 L 0,500 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          fill-opacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-1"
        ></path>
      </svg>

      <Stack
        direction="row"
        alignItems="center"
        maxH="50vh"
        height="50vh"
        maxW="100vw"
        ml={0}
        bg="#f24861"
        justifyContent="center"
      >
        <div className="w-1/2 ml-20">
          <h1 className="text-4xl text-white">Why ChainFusion?</h1>
        </div>
        <div className=" w-1/2">
          <Box p={4} bg="white" borderRadius="lg" mr="20">
            <Text fontSize="lg">
              ChainFusion represents a revolutionary approach to blockchain
              integration, seamlessly blending the power of distributed ledger
              technology with the agility of AI-driven systems. As a
              cutting-edge platform, ChainFusion stands as a beacon of
              innovation in the ever-evolving landscape of digital transactions
              and data security. By fusing blockchains immutable ledger with AIs
              dynamic capabilities, ChainFusion offers unparalleled resilience
              against emerging threats in the digital realm. It serves as a
              cornerstone in the architecture of modern digital infrastructure,
              providing a robust foundation for decentralized applications and
              secure transactions. ChainFusions visionary design transcends
              traditional boundaries, ushering in a new era of trust,
              transparency, and efficiency in the global economy. With its
              unique blend of technology and vision, ChainFusion is poised to
              redefine the way we interact with digital assets and shape the
              future of decentralized ecosystems.
            </Text>
          </Box>
        </div>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        maxH="50vh"
        height="50vh"
        maxW="100vw"
        ml={0}
        bg="#f24861"
        justifyContent="space-between"
        spacing="20%"
      >
        <div className=" w-1/2">
          <Box p={4} bg="white" borderRadius="lg" ml="20">
            <Text fontSize="lg">
              Embarking on the onboarding journey with our app, powered by
              Web3Auth, is a transformative experience where cutting-edge
              security converges with unparalleled customization and
              user-centricity. Through the innovative Multi-Party Computation
              (MPC) technology, our app ensures robust account security without
              the burden of traditional KYC or AML requirements, safeguarding
              against single points of failure with enterprise-grade key
              management methods. Users retain full control over their accounts,
              establishing non-custodial security factors and seamlessly
              transitioning across applications with ease. The fusion of hot
              wallet convenience and cold wallet security, made possible by
              Web3Auth's MPC foundation, delivers a seamless user experience
              unparalleled in its adaptability and accessibility. With Web3Auth,
              our app offers a gateway to a realm of digital ownership and
              identity where simplicity and familiarity reign supreme. From
              preserving brand integrity to simplifying onboarding for NFT
              creators and enthusiasts, our app leverages Web3Auth's seamless
              integration to empower users and businesses alike. By harnessing
              the power of Web3Auth, our app is committed to fostering a future
              where digital ownership is accessible to all, revolutionizing the
              way we interact with and secure our digital assets.
            </Text>
          </Box>
        </div>
        <div className="w-1/2 mr-20">
          <h1 className="text-4xl text-white">
            What is the Onboaring Process?
          </h1>
        </div>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        maxH="50vh"
        height="50vh"
        maxW="100vw"
        ml={0}
        bg="#f24861"
        justifyContent="center"
      >
        <div className="w-1/2 ml-20">
          <h1 className="text-4xl text-white">How Are We Secured?</h1>
        </div>
        <div className=" w-1/2">
          <Box p={4} bg="white" borderRadius="lg" mr="20">
            <Text fontSize="lg">
              Experience the pinnacle of in-house security solutions with our
              app, where seamless integration meets advanced identity
              verification. With Decentralized ID, users gain access to
              lightning-fast ID verification bolstered by cutting-edge
              cryptography, ensuring the transformation of verified ID data into
              resilient Digital ID credentials. Our in-house security solution
              enables swift onboarding across trusted relationships, slashing
              verification costs and minimizing drop-offs while empowering
              individuals to seamlessly transition into new opportunities. We
              expedite the launch of our digital identity ecosystem, seamlessly
              integrating secure, reusable Digital Identity credentials without
              the need for extensive infrastructure. Committed to privacy and
              transparency, Dock undergoes regular third-party security audits
              and adheres to GDPR compliance standards, guaranteeing users full
              control over their personal data. Join us in revolutionizing
              in-house security solutions, where efficiency, reliability, and
              global adoption converge to redefine the future of identity
              verification.
            </Text>
          </Box>
        </div>
      </Stack>
    </>
  );
};

export default page;

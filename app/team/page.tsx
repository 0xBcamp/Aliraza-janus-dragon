import React from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  Avatar,
  Icon,
  Container,
  Wrap,
} from "@chakra-ui/react";
import Navbar from "../navbar";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const page = () => {
  const teamMembers = [
    {
      name: "Ali Raza",
      position: "Blockchain Mentor",
      github: "https://github.com/alirazacodes",
      linkedin: "https://www.linkedin.com/in/alirazacodes/",
      avatar:
        "https://media.licdn.com/dms/image/D4D03AQEXatAztWW9gA/profile-displayphoto-shrink_800_800/0/1685641983840?e=1712793600&v=beta&t=Jq9_IT-80S8gbJLYwvMZ61LbrTCHipi1VwlnoqZd1W4",
    },
    {
      name: "Abdelrahman Sheta",
      position: "Smart Contract Integration",
      github: "https://www.linkedin.com/in/abdelrahman-m-sheta/",
      linkedin: "https://www.linkedin.com/in/abdelrahman-m-sheta/",
      avatar:
        "https://media.licdn.com/dms/image/D4D03AQGFfNsRSEQJKQ/profile-displayphoto-shrink_800_800/0/1697809305797?e=1712793600&v=beta&t=jqw7tj10lmIuNIp95Zv_0TmyVoKot9BFKRSlU1NdazU",
    },
    {
      name: "Muhammad Masood",
      position: "Backend Developer",
      github: "https://github.com/Muhammad-Masood",
      linkedin: "",
      avatar: "https://avatars.githubusercontent.com/u/124390185?v=4",
    },
    {
      name: "Mani Chandra Teja Gaddam",
      position: "Smart Contract Developer",
      github: "https://github.com/janesmith",
      linkedin: "https://www.linkedin.com/in/manichandrateja/",
      avatar:
        "https://media.licdn.com/dms/image/D4E35AQFSUhgoIe-pGQ/profile-framedphoto-shrink_800_800/0/1674104218513?e=1707663600&v=beta&t=bSFORLzySRLHPa9Ufg1RMIczPI5qirR2fo-zl2BmPIA ",
    },
    {
      name: "Aidan Davy",
      position: "Project Manager & Frontend Dev",
      github: "https://github.com/Adavy561",
      linkedin: "https://www.linkedin.com/in/aidan-davy-7b0437236/",
      avatar:
        "https://media.licdn.com/dms/image/D5603AQER28nXRuxXMw/profile-displayphoto-shrink_800_800/0/1697226357011?e=1712793600&v=beta&t=Bzo435n_kx7vXKTulrf7vD2r5RbD5ess3G49SHDehmM",
    },
  ];

  const GithubIcon = () => <FaGithub />;

  return (
    <>
      <Navbar />
      <Container
        justifyContent="center"
        width="100vw"
        maxW="100vw"
        textAlign="center"
      >
        <Text className="text-4xl" fontWeight="bold" color="#b680f8">
          Meet the Team
        </Text>
      </Container>
      <Flex
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
      >
        {teamMembers.map((member, index) => (
          <Box
            key={index}
            p={6}
            shadow="lg"
            borderWidth="2px"
            borderRadius="xl"
            m={4}
            maxW="15%"
            minW="15%"
            height="34vh"
            bg="gray.100"
            textAlign="center"
            justifyContent="space-between" // Add this line
          >
            <Avatar
              size="xl"
              name={member.name}
              src={member.avatar}
              mb={4}
              mx="auto"
            />
            <Wrap
              justify="center"
              fontSize="2xl"
              fontWeight="bold"
              mb={2}
              color="teal.600"
              height="23%"
            >
              {member.name}
            </Wrap>
            <Text fontSize="lg" color="gray.600" mb={4} height="16%">
              {member.position}
            </Text>
            <Flex justifyContent="center">
              <Link href={member.github} isExternal mr={4}>
                <FaGithub size={35} />
              </Link>
              <Link href={member.linkedin} isExternal>
                <FaLinkedin size={35} />
              </Link>
            </Flex>
          </Box>
        ))}
      </Flex>
      <svg
        width="100%"
        height="100%"
        id="svg"
        viewBox="0 0 1440 490"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out delay-150 overflow-hidden"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stop-color="#F78DA7"></stop>
            <stop offset="95%" stop-color="#8ED1FC"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,500 L 0,93 C 51.78865979381443,94.73545655375553 103.57731958762886,96.47091310751105 167,91 C 230.42268041237114,85.52908689248895 305.479381443299,72.85180412371132 375,82 C 444.520618556701,91.14819587628868 508.5051546391753,122.12187039764362 560,128 C 611.4948453608247,133.87812960235638 650.5,114.66071428571426 716,104 C 781.5,93.33928571428574 873.4948453608247,91.23527245949928 928,80 C 982.5051546391753,68.76472754050072 999.520618556701,48.39819587628865 1047,56 C 1094.479381443299,63.60180412371135 1172.4226804123712,99.1719440353461 1243,110 C 1313.5773195876288,120.8280559646539 1376.7886597938145,106.91402798232696 1440,93 L 1440,500 L 0,500 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          fill-opacity="0.4"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stop-color="#F78DA7"></stop>
            <stop offset="95%" stop-color="#8ED1FC"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,500 L 0,218 C 72.72809278350516,240.38254786450665 145.45618556701032,262.7650957290133 205,261 C 264.5438144329897,259.2349042709867 310.9033505154639,233.32216494845358 362,224 C 413.0966494845361,214.67783505154642 468.93041237113414,221.94624447717234 522,225 C 575.0695876288659,228.05375552282766 625.375,226.89285714285717 690,222 C 754.625,217.10714285714283 833.5695876288659,208.48232695139913 903,221 C 972.4304123711341,233.51767304860087 1032.346649484536,267.17783505154637 1091,257 C 1149.653350515464,246.82216494845366 1207.0438144329898,192.80633284241534 1265,179 C 1322.9561855670102,165.19366715758466 1381.478092783505,191.5968335787923 1440,218 L 1440,500 L 0,500 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          fill-opacity="0.53"
          className="transition-all duration-300 ease-in-out delay-150 path-1"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stop-color="#F78DA7"></stop>
            <stop offset="95%" stop-color="#8ED1FC"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,500 L 0,343 C 63.083394698085414,343.19293078055966 126.16678939617083,343.38586156111927 186,349 C 245.83321060382917,354.61413843888073 302.4162371134021,365.6494845360825 365,367 C 427.5837628865979,368.3505154639175 496.1682621502209,360.01620029455074 546,360 C 595.8317378497791,359.98379970544926 626.9107142857142,368.28571428571433 686,364 C 745.0892857142858,359.71428571428567 832.1888807069221,342.840942562592 901,339 C 969.8111192930779,335.159057437408 1020.3337628865977,344.35051546391753 1082,349 C 1143.6662371134023,353.64948453608247 1216.4760677466863,353.75699558173784 1278,352 C 1339.5239322533137,350.24300441826216 1389.7619661266567,346.6215022091311 1440,343 L 1440,500 L 0,500 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          fill-opacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-2"
        ></path>
      </svg>
    </>
  );
};

export default page;

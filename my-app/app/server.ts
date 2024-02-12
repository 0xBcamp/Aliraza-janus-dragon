// "use server";

// import { getSigner, signer } from "@/lib/utils";
// import { WalletContext } from "@/providers/Providers";
// import { DecentralizeIdentity } from "cf-identity";
// import { JsonRpcSigner, ethers, toNumber } from "ethers";
// import { useContext } from "react";

// export const initIdentitySDK = async () => {
//     try {
//         console.log("signer from server")
//         console.log(await getSigner().getAddress());
//         const decentralizedIdentity = new DecentralizeIdentity(
//           signer,
//           "0Wvz5s13JbRDMHxCaf-v-r-ivOpbwN-6SeUTaHBZ8ex6zRNdUeJU1aH9IYquhe3cQyCFcoulDGJl9IH8rnRLjw"
//         );
//         // await initIdentitySDK(signer);
//         // console.log("e344343");
//         const maxDid = await decentralizedIdentity.getMaxDIDs();
//         // setIdentitySDK(decentralizedIdentity);
//         console.log(maxDid);
//         return decentralizedIdentity;
//       } catch (error) {
//         console.log(error);
//       }
// };

import Image from "next/image";
import image from "@/public/image.svg";
import image2 from "@/public/image2.svg";

export default function Home() {
  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Welcome to ChainFusion Decentralized Identity
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-4">
              ChainFusion is a revolutionary project aiming to establish a
              decentralized identity ecosystem. Our mission is to empower
              individuals with control over their digital identities, ensuring
              privacy, security, and interoperability across various platforms.
            </p>
            <p className="text-lg lg:text-xl text-gray-600 mb-4">
              With ChainFusion, users can securely manage their credentials,
              interact seamlessly with decentralized applications, and
              participate in a trustless and transparent ecosystem.
            </p>
          </div>
          <div className="flex justify-center">
            {/* <Image src={di} alt="Project Image" /> */}
            <Image src={image} alt="image_1"></Image>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="flex justify-center">
            <Image src={image2} alt="image_2" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Our Vision
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 mb-4">
              At ChainFusion, we envision a future where individuals have full
              sovereignty over their digital identities, enabling secure and
              frictionless interactions in the digital world. Through
              cutting-edge blockchain technology, we strive to revolutionize
              identity management, paving the way for a more inclusive,
              equitable, and decentralized society.
            </p>
            <p className="text-lg lg:text-xl text-gray-600 mb-4">
              Join us on this journey towards a brighter and more secure digital
              future!
            </p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Chain Fusion Decentralized Identity Kit
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 mb-4">
            The Chain Fusion Decentralized Identity Kit simplifies the process
            of managing and verifying users' identities digitally. It offers
            various functionalities to support decentralized identity management
            seamlessly.
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
            Features
          </h3>
          <ul className="list-disc list-inside text-lg lg:text-xl text-gray-600 mb-4">
            <li>Creating DIDs (Decentralized Identifiers)</li>
            <p>
              DIDs are unique identifiers for users, associated with their
              private keys, and entirely owned and governed by them. With this
              kit, users can create as many DIDs as they want, each representing
              separate profiles for their credentials.
            </p>
            <li>Issue VCs (Verifiable Credentials)</li>
            <p>
              The kit allows users to issue verifiable credentials (VCs) to
              other users. These credentials contain attestation information and
              are cryptographically signed by the issuer, providing a secure and
              tamper-proof way to verify users' attributes and qualifications.
            </p>
            <li>Verify Credentials</li>
            <p>
              Users can verify the authenticity and validity of credentials
              issued by others using this kit. By providing verification
              mechanisms, it ensures trust and reliability in the digital
              identity ecosystem.
            </p>
          </ul>
          <footer className="text-center">
            <Link
              href="https://www.npmjs.com/package/cf-identity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              Install Chain Fusion Decentralized Identity Kit
            </Link>
          </footer>
        </div>
        <footer className="mt-8 text-center">
          <Link
            href="https://github.com/0xBcamp/Aliraza-janus-dragon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700"
          >
            View on GitHub
          </Link>
        </footer>
      </div>
    </div>
  );
}

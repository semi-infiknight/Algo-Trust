'use client'
import Link from 'next/link';
// import MobileMenu from './mobile-menu';
import { PeraWalletConnect } from "@perawallet/connect";
import { useEffect, useState } from 'react';

// Create the PeraWalletConnect instance outside of the component
const peraWallet = new PeraWalletConnect();
const shortenAddress = (address: string | any[]) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
export default function Header() {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  const isConnectedToPeraWallet = !!accountAddress;

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet.reconnectSession().then((accounts) => {
      // Setup the disconnect event listener
      peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

      if (accounts.length) {
        setAccountAddress(accounts[0]);
      }
    });
  }, []);

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((newAccounts) => {
        // Setup the disconnect event listener
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

        setAccountAddress(newAccounts[0]);
      })
      .catch((error) => {
        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax, you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // Log the necessary errors
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();

    setAccountAddress(null);
  }

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link href="/" className="block" aria-label="Cruip">
              <svg className="w-8 h-8 fill-current text-purple-600" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.970 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z" />
              </svg>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              
              {isConnectedToPeraWallet && (
                <button className="bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                  {shortenAddress(accountAddress)}
                </button>
              )}
              <li>
                {/* <ConnectButton /> */}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded"
                  onClick={isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectWalletClick}
                >
                  {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
                </button>
              </li>

            </ul>
          </nav>

          {/* <MobileMenu /> */}
        </div>
      </div>
    </header>
  );
}

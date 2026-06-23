import React from "react";

function Footer() {
  return (
    <footer 
      className="border-t border-gray-200 mt-20 antialiased flex flex-col justify-between min-h-[calc(100vh-110px)]"
      style={{
        backgroundColor: "#f5f5f5",
        fontFamily: "mr-eaves-xl-modern, sans-serif"
      }}
    >
      {/* Upper Links Grid Layout */}
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 text-left">
        
        {/* Column 1: All Categories */}
        <div className="footer__footerColumn">
          <h4 className="text-[17px] font-bold text-[#000000] mb-4 tracking-normal">All Categories</h4>
          <ul className="flex flex-col gap-2 text-[16px] font-normal text-[#000000] leading-tight">
            <li className="cursor-pointer">Grocery</li>
            <li className="cursor-pointer">Electronics</li>
            <li className="cursor-pointer">Fashion</li>
            <li className="cursor-pointer">Beauty</li>
            <li className="cursor-pointer">Home & Kitchen</li>
            <li className="cursor-pointer">Premium Fruits</li>
            <li className="cursor-pointer">Books</li>
            <li className="cursor-pointer">Furniture</li>
          </ul>
        </div>

        {/* Column 2: Popular Categories */}
        <div className="footer__footerColumn">
          <h4 className="text-[17px] font-bold text-[#000000] mb-4 tracking-normal">Popular Categories</h4>
          <ul className="flex flex-col gap-2 text-[16px] font-normal text-[#000000] leading-tight">
            <li className="cursor-pointer">Fresh</li>
            <li className="cursor-pointer max-w-[220px]">Biscuits Drinks & Packaged Foods</li>
            <li className="cursor-pointer">Cooking Essentials</li>
            <li className="cursor-pointer">Personal Care</li>
            <li className="cursor-pointer">Beauty</li>
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">Kitchenware</li>
            <li className="cursor-pointer">Tableware</li>
            <li className="cursor-pointer">School, Office & Stationery</li>
            <li className="cursor-pointer">Disposables</li>
          </ul>
        </div>

        {/* Column 3: Customer Account */}
        <div className="footer__footerColumn">
          <h4 className="text-[17px] font-bold text-[#000000] mb-4 tracking-normal">Customer Account</h4>
          <ul className="flex flex-col gap-2 text-[16px] font-normal text-[#000000] leading-tight">
            <li className="cursor-pointer">My Account</li>
            <li className="cursor-pointer">My Orders</li>
            <li className="cursor-pointer">Wishlist</li>
            <li className="cursor-pointer">Delivery Addresses</li>
            <li className="cursor-pointer">JioMart Wallet</li>
          </ul>
        </div>

        {/* Column 4: Help & Support */}
        <div className="footer__footerColumn">
          <h4 className="text-[17px] font-bold text-[#000000] mb-4 tracking-normal">Help & Support</h4>
          <ul className="flex flex-col gap-2 text-[16px] font-normal text-[#000000] leading-tight">
            <li className="cursor-pointer">About Us</li>
            <li className="cursor-pointer">FAQ</li>
            <li className="cursor-pointer">Terms & Conditions</li>
            <li className="cursor-pointer">Privacy Policy</li>
            <li className="cursor-pointer">E-waste Policy</li>
            <li className="cursor-pointer">Cancellation & Return Policy</li>
            <li className="cursor-pointer">Shipping & Delivery Policy</li>
            <li className="cursor-pointer">AC Installation by resQ</li>
          </ul>
        </div>

        {/* Column 5: Contact Us & App Downloads */}
        <div className="footer__footerColumn flex flex-col gap-5">
          <div className="footer__contactInfo">
            <h4 className="text-[17px] font-bold text-[#000000] mb-3 tracking-normal">Contact Us</h4>
            <div className="text-[16px] font-normal text-[#000000] flex flex-col gap-1 leading-tight">
              <div className="footer__contactItem">
                <span>WhatsApp us: </span>
                <a className="font-bold text-[#000000]" href="https://wa.me/917000370003">70003 70003</a>
              </div>
              <div className="footer__contactItem mt-1">
                <span>Call us: </span>
                <a className="font-bold text-[#000000]" href="tel:18008901222">1800 890 1222</a>
              </div>
              <div className="text-[14px] text-[#000000] font-medium mt-1">8:00 AM to 8:00 PM, 365 days</div>
            </div>
          </div>

          <div className="footer__supportText text-[16px] font-normal text-[#000000] leading-snug max-w-[280px]">
            Should you encounter any bugs, glitches, lack of functionality, delayed deliveries, billing errors or other problems on the website.
          </div>

          <div className="footer__appDownload">
            <h4 className="text-[17px] font-bold text-[#000000] mb-3 tracking-normal">Download App</h4>
            <div className="flex flex-row gap-2 items-center">
              <a href="/sections/scheduled-best-deals" target="_blank" className="h-[36px] block transition-transform active:scale-95">
                <img src="/play_store.png" alt="Get it on Google Play" className="h-full w-auto object-contain" />
              </a>
              <a href="/sections/scheduled-best-deals" target="_blank" className="h-[36px] block transition-transform active:scale-95">
                <img src="/app_store.png" alt="Download on the App Store" className="h-full w-auto object-contain" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal Ribbon Bar */}
      <div className="border-t border-gray-200 bg-white py-4 mt-auto w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] font-normal text-[#000000]">
          <div className="flex items-center gap-2.5">
            <img src="/jio mart.png" alt="JioMart Logo" className="w-[18px] h-[18px] object-contain" />
            <span className="font-medium">© 2026 All rights reserved. Reliance Retail Ltd.</span>
          </div>
          <div className="text-[#000000] text-[13px] font-medium tracking-normal">
            Best viewed on Microsoft Edge 81+, Mozilla Firefox 75+, Safari 5.1.5+, Google Chrome 80+
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
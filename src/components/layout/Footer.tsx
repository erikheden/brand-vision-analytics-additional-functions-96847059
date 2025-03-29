import React from "react";
const Footer = () => {
  return <div className="w-full mt-auto bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[100px] py-0 my-0">
        <p className="text-[6px] text-center text-neutral-600">
          © 2025 SB Insight AB. All rights reserved.
        </p>
        <p className="text-[6px] mt-2 text-center text-neutral-600">
          The data, visualisations, and insights displayed on this platform are the exclusive property of SB Insight AB and are protected by copyright and other intellectual property laws. Access is granted solely for internal review and analysis by authorised users. Exporting, reproducing, distributing, or publishing any content from this platform—whether in whole or in part—without prior written permission from SB Insight AB is strictly prohibited.
        </p>
        <p className="text-[8px] text-center text-white mt-2">
          Unauthorised use may result in legal action. For inquiries regarding permitted use, please contact info@sb-insight.com.
        </p>
      </div>
    </div>;
};
export default Footer;
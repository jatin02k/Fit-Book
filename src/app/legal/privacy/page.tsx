export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 prose prose-slate">
      <h1> <b>Privacy Policy</b></h1>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      
      <p>
        At Appointor, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
      </p>
      <br />
      <h2><b>1. Information We Collect</b></h2>
      <p>
       We collect information you provide directly to us when you create an account, subscribe to our services, or communicate with us. This includes:
      </p>
      <ul>
        <li>Name and contact information (email, phone number)</li>
        <li>Business details (gym name, address)</li>
        <li>Payment information (processed securely by Razorpay)</li>
      </ul>
      <br />
      <h2><b>2. How We Use Your Information</b></h2>
      <p>
          We use your information to:
      </p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send you technical notices, updates, and support messages</li>
      </ul>
      <br />  
      <h2><b>3. Data Security</b></h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
      </p>
      <br />

      <h2><b>4. Contact Us</b></h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:jatin02kr@gmail.com">jatin02kr@gmail.com</a>.
      </p>
    </div>
  );
}

export default function FAQPage() {
  const faqItems = [
    {
      question: "How far in advance can I book?",
      answer: "You can book appointments up to 30 days in advance.",
    },
    {
      question: "Can I cancel or reschedule?",
      answer: "Yes, you can cancel or reschedule up to 24 hours before your appointment.",
    },
    {
      question: "What should I bring?",
      answer: "Bring comfortable workout clothes, athletic shoes, and a water bottle.",
    },
    {
      question: "Do you offer group discounts?",
      answer: "Yes, we offer discounts for groups of 3 or more. Contact us for details.",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">FAQ</h1>
        
        <div className="space-y-10">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {item.question}
              </h2>
              <p className="text-lg text-gray-600">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
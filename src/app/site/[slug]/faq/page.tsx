export default function FAQPage() {
  const faqItems = [
    {
      question: "How do I book an appointment",
      answer: "Select a service, choose an available date and time, enter your details, and confirm. You will receive a confirmation instantly.",
    },
    {
      question: "Do I need to create an account?",
      answer: "No. Booking takes less than a minute and does not require creating an account.",
    },
    {
      question: "Is payment required to confirm the booking?",
      answer: "If the clinic requires advance payment, you will be asked to pay during booking. This helps secure your time slot and reduce no-shows.",
    },
    {
      question: "Will I receive a confirmation?",
      answer: "Yes. You will get a confirmation message after booking. Reminders are sent before your appointment.",
    },
    {
      question: "What if I miss my appointment?",
      answer: "Yes, if the clinic allows it. Use the reschedule or cancel option provided in your confirmation message.",
    },
    {
      question: "Can I reschedule or cancel my appointment?",
      answer: "Yes, if the clinic allows it. Use the reschedule or cancel option provided in your confirmation message.",
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
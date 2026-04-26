import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000919] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero / Intro Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div>
            <p className="text-[#0A6ED3] font-semibold uppercase tracking-[0.2em] text-sm mb-4">
              Contact Us
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Let’s Connect with{" "}
              <span className="text-[#0A6ED3]">Smart Campus 360</span>
            </h1>

            <p className="text-gray-300 text-lg leading-8 mt-6 max-w-xl">
              Have questions about facility booking, maintenance tracking, or
              campus operations? Our team is here to help you with everything
              related to Smart Campus 360.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate("/login")}
                className="bg-[#0A6ED3] hover:bg-[#054E98] text-white px-7 py-3 rounded-xl font-medium transition shadow-md"
              >
                Get Support
              </button>

              <button
                onClick={() => navigate("/features")}
                className="border border-white/20 hover:border-[#0A6ED3] hover:text-[#0A6ED3] text-white px-7 py-3 rounded-xl font-medium transition"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-[#07152d] border border-white/10 rounded-3xl p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl font-semibold mb-2">Quick Contact</h2>
            <p className="text-gray-400 text-sm mb-8">
              Reach us through any of these channels.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0A6ED3]/15 border border-[#0A6ED3]/20 flex items-center justify-center text-[#0A6ED3]">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-medium">
                    support@smartcampus360.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0A6ED3]/15 border border-[#0A6ED3]/20 flex items-center justify-center text-[#0A6ED3]">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white font-medium">+94 11 234 5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0A6ED3]/15 border border-[#0A6ED3]/20 flex items-center justify-center text-[#0A6ED3]">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white font-medium">
                    Smart Campus 360, University IT Center
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0A6ED3]/15 border border-[#0A6ED3]/20 flex items-center justify-center text-[#0A6ED3]">
                  <FaClock />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Support Hours</p>
                  <p className="text-white font-medium">
                    Mon - Fri | 8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-[#0A6ED3] hover:border-[#0A6ED3] transition flex items-center justify-center">
                <FaFacebookF />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-[#0A6ED3] hover:border-[#0A6ED3] transition flex items-center justify-center">
                <FaLinkedinIn />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-[#0A6ED3] hover:border-[#0A6ED3] transition flex items-center justify-center">
                <FaInstagram />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10">
          {/* Form */}
          <div className="bg-[#07152d] border border-white/10 rounded-3xl p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl font-semibold mb-2">Send Us a Message</h2>
            <p className="text-gray-400 text-sm mb-8">
              Fill in the details below and our team will get back to you soon.
            </p>

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#0A6ED3]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#0A6ED3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#0A6ED3]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#0A6ED3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#0A6ED3]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  rows="6"
                  placeholder="Write your message here..."
                  className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#0A6ED3] resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-[#0A6ED3] hover:bg-[#054E98] text-white px-8 py-3 rounded-xl font-medium transition shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Side Info */}
          <div className="space-y-6">
            <div className="bg-[#07152d] border border-white/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Why Contact Us?</h3>
              <ul className="space-y-4 text-gray-300 text-sm leading-7">
                <li>Get help with campus facility booking issues</li>
                <li>Report maintenance or system-related concerns</li>
                <li>Ask about role-based access and account support</li>
                <li>Receive guidance on using Smart Campus 360 features</li>
              </ul>
            </div>

            <div className="bg-[#07152d] border border-white/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Saturday</span>
                  <span>9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-[#07152d] border border-white/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Need Quick Access?</h3>
              <p className="text-sm text-gray-300 leading-7 mb-5">
                Log in to your Smart Campus 360 account to manage your bookings,
                maintenance requests, and campus activities faster.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="border border-white/20 hover:border-[#0A6ED3] hover:text-[#0A6ED3] text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#000714] px-6 md:px-12 lg:px-20 py-8 text-center text-sm text-gray-400">
        © 2026 Smart Campus 360. All rights reserved.
      </footer>
    </div>
  );
}

export default ContactPage;
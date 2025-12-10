import { SOCIAL_LINKS } from '../utils/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      text: 'DevChallenge helped me stay motivated and track my progress!',
    },
    {
      name: 'Michael Chen',
      role: 'CS Student',
      text: 'The group challenges are amazing for learning with friends.',
    },
    {
      name: 'Emma Davis',
      role: 'Full Stack Developer',
      text: 'Perfect platform for competitive programming practice.',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-center mb-8">What Our Users Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h4 className="text-lg font-semibold mb-4">DevChallenge</h4>
              <p className="text-gray-400 text-sm">
                Code. Compete. Connect. Your competitive programming social platform.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/stats" className="hover:text-white">Stats</a></li>
                <li><a href="/challenges" className="hover:text-white">Groups</a></li>
                <li><a href="/profile" className="hover:text-white">Profile</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href={SOCIAL_LINKS.TWITTER} className="text-gray-400 hover:text-white">
                  Twitter
                </a>
                <a href={SOCIAL_LINKS.GITHUB} className="text-gray-400 hover:text-white">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {currentYear} DevChallenge. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

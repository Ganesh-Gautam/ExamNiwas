export default function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/60 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 md:px-8" >
        
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">ExamNiwas</h2>
          <p className="mt-2 text-sm text-zinc-600">
            An Examination Platform.
          </p>
        </div> 
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Quick Links</h2>
          <ul className="mt-2 space-y-2 text-sm text-zinc-600">
            <li><a href="/about" className="hover:text-zinc-900">About Us</a></li>
            <li><a href="/services" className="hover:text-zinc-900">Services</a></li>
            <li><a href="/blog" className="hover:text-zinc-900">Blog</a></li>
            <li><a href="/contact" className="hover:text-zinc-900">Contact</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Connect</h2>
          <ul className="mt-2 space-y-2 text-sm text-zinc-600">
            <li><a href="#" className="hover:text-zinc-900">ExamNiwas.com</a></li>
            <li><a href="#" className="hover:text-zinc-900">Twitter</a></li>
            <li><a href="#" className="hover:text-zinc-900">GitHub</a></li>
            <li><a href="#" className="hover:text-zinc-900">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/40 px-4 py-4 text-center text-xs text-zinc-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()}ExamNiwas. All rights reserved.
      </div>
    </footer>
  );
}

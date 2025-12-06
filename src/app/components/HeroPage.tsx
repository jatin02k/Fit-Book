import { Sparkles, Zap } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ImageWithFallback } from "../(public)/figma/imageWithFallback";

export function HeroPage() {
  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758957646695-ec8bce3df462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwZXF1aXBtZW50JTIwbW9kZXJufGVufDF8fHx8MTc1OTc2MzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Modern gym equipment"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/70 to-orange-900/80"></div>

          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-orange-400" />

            <span className="text-sm text-white/90">
              Premium Fitness Experience
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
            Transform Your
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book expert trainers, join dynamic classes, and reach your goals
            with our premium fitness services.
          </p>
          

          <Link href="/services" passHref>
        <Button
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 px-8 py-4 text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
        >
          <Zap className="mr-2 h-5 w-5" />
          Book Now
        </Button>
      </Link>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-black mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                FitBook
              </span>
              ?
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience premium fitness with personalized training, expert
              instructors, and flexible scheduling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">💪</span>
              </div>

              <h3 className="text-xl text-black mb-2">Expert Trainers</h3>

              <p className="text-gray-600">
                Work with certified professionals who understand your unique
                fitness goals.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">📅</span>
              </div>

              <h3 className="text-xl text-black mb-2">Flexible Scheduling</h3>

              <p className="text-gray-600">
                Book sessions that fit your busy lifestyle with our easy online
                system.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🏆</span>
              </div>

              <h3 className="text-xl text-black mb-2">Proven Results</h3>

              <p className="text-gray-600">
                Join thousands who have achieved their fitness goals with our
                programs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

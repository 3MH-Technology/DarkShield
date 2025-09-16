import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-md rounded-lg p-8 md:p-12 border border-gray-700/50">
      <h1 class="font-orbitron text-4xl md:text-5xl font-black text-cyan-400 mb-4 text-center uppercase">About DarkShield</h1>
      <p class="text-center text-gray-400 text-lg mb-10">Unveiling the philosophy and the force behind the digital fortress.</p>
      
      <div class="space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          <strong class="text-white">DarkShield is more than a blog;</strong> it's a digital fortress of knowledge in the relentless war of cyberspace. We were forged in the crucible of code, dedicated to demystifying the complex world of cybersecurity for professionals, enthusiasts, and the cyber-curious alike. Our mission is to arm our readers with the latest intelligence, tactics, and tools to navigate and defend the digital frontier.
        </p>
        
        <div class="border-t border-cyan-500/20 pt-8">
            <h2 class="font-orbitron text-3xl font-bold text-white mb-4">The White Wolf Persona</h2>
            
            <p>
              At the heart of DarkShield operates its enigmatic founder, known only as <strong class="text-cyan-400 font-semibold tracking-wide">"The White Wolf"</strong>. Not a person, but a persona—an identity representing a collective of seasoned cybersecurity experts, ethical hackers, and AI architects. The White Wolf symbolizes a rare breed in the digital ecosystem: a protector that moves with the stealth and precision of a predator, yet operates under a strict code of ethics. 
            </p>
            
            <p>
              This persona embodies our core philosophy: to understand the mindset of an attacker to build an impenetrable defense. The White Wolf is the silent guardian, the expert in the shadows, sharing decades of experience from the front lines of digital conflict. The insights you find here are not just theoretical; they are battle-tested and forged from real-world scenarios.
            </p>
        </div>
        
        <p class="text-center font-orbitron text-cyan-400 pt-6 border-t border-cyan-500/20">
          Welcome to our domain. Stay vigilant.
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}

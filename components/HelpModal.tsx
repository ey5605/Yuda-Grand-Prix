import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 text-white rounded-lg shadow-2xl shadow-cyan-500/30 p-8 max-w-md w-full border border-cyan-700 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl leading-none"
          aria-label="Close instructions"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">How to Play</h2>
        
        <div className="space-y-6 text-gray-300 text-center">
          <div>
            <h3 className="font-bold text-lg text-white mb-2 uppercase tracking-wider">Goal</h3>
            <p>Dodge traffic and survive as long as you can. You start with <strong>4 lives</strong>. Use them wisely to get the highest score!</p>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-bold text-lg text-white mb-3 uppercase tracking-wider">Controls</h3>
            <div className="space-y-4">
               <p>
                <span className="font-bold text-lg">Steer</span>
                <br/>
                Tap the <strong>lower left/right part</strong>, or press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md">←</kbd> / <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md">→</kbd>.
              </p>
              <p>
                <span className="font-bold text-lg">Accelerate</span>
                <br/>
                Tap the <strong>upper part</strong> of the screen, or press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md">↑</kbd>.
              </p>
              <p>
                <span className="font-bold text-lg">Brake</span>
                <br/>
                Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md">↓</kbd>. (Keyboard only)
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-bold text-lg text-white mb-3 uppercase tracking-wider">Checkpoints & Lives</h3>
             <p>
                Pass through <span className="text-cyan-400 font-bold">checkpoints</span> to save your score. Crashing costs a life, but you'll respawn at your last checkpoint.
            </p>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-bold text-lg text-white mb-3 uppercase tracking-wider">Special Items</h3>
             <p>
                Collect <span className="text-rose-500 font-bold">hearts</span> on the road to gain an extra life!
            </p>
            <p className="mt-2">
                Hit the special <span className="text-lime-400 font-bold">green sports car</span> for a speed boost and +500 points!
            </p>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-bold text-lg text-white mb-3 uppercase tracking-wider">Road Hazards</h3>
            <div className="space-y-3">
              <p>
                Hitting another car or an <span className="text-orange-500 font-bold">orange barrier</span> will cost you a life! Run out of lives and it's game over.
              </p>
               <p>
                Watch out for <span className="font-bold" style={{color: '#6b7280'}}>oil slicks!</span> They'll make you spin out of control for a moment.
              </p>
               <p>
                Slow down over yellow <span className="text-amber-500 font-bold">speed bumps</span>. They won't crash you, but they'll kill your momentum.
              </p>
               <p>
                Avoid the blinking <span className="text-gray-400 font-bold">mines</span>! Hitting one will send your car into a short spin.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-400 transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
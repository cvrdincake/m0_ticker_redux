import { useState } from 'react';
import BroadcastOverlay from './BroadcastOverlay';

export default {
  title: 'Patterns/BroadcastOverlay',
  component: BroadcastOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Broadcast overlay component for ticker-style notifications and announcements that appear at the bottom of the screen.'
      }
    }
  },
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Whether the overlay is visible'
    },
    text: {
      control: 'text',
      description: 'Text content to display in the ticker'
    },
    duration: {
      control: { type: 'number', min: 1000, max: 60000, step: 1000 },
      description: 'Animation duration in milliseconds'
    },
    autoHide: {
      control: 'boolean',
      description: 'Whether to automatically hide after a delay'
    },
    autoHideDelay: {
      control: { type: 'number', min: 1000, max: 30000, step: 1000 },
      description: 'Delay before auto-hiding in milliseconds'
    }
  }
};

// Story wrapper that manages overlay state
const BroadcastWrapper = (args) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            background: isVisible ? '#dc2626' : 'var(--ink)',
            color: 'var(--surface)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '16px'
          }}
        >
          {isVisible ? 'Hide Broadcast' : 'Show Broadcast'}
        </button>
        
        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: 0 }}>
          {isVisible ? 'Broadcast is visible at the bottom of the screen' : 'Click to show the broadcast overlay'}
        </p>
      </div>
      
      <BroadcastOverlay
        {...args}
        isVisible={isVisible}
        onHide={() => setIsVisible(false)}
      />
    </div>
  );
};

export const Default = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: 'Breaking: This is a sample broadcast message that scrolls across the screen'
  }
};

export const NewsAlert = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: '📺 LIVE: Important news update - Stay tuned for more information as this story develops',
    duration: 15000
  }
};

export const StockTicker = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: '📈 NASDAQ: +1.2% | S&P 500: +0.8% | DOW: +1.1% | AAPL: $150.25 (+2.1%) | GOOGL: $2,750.00 (+1.5%) | TSLA: $800.00 (-0.3%)',
    duration: 25000
  }
};

export const EventAnnouncement = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: '🎉 Join us for the annual developer conference! Register now at developer-conf.com - Early bird pricing ends soon!',
    duration: 18000
  }
};

export const WeatherAlert = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: '⚠️ WEATHER ALERT: Heavy rain expected in the metropolitan area. Please drive safely and allow extra travel time.',
    duration: 12000
  }
};

export const AutoHide = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: 'This message will automatically hide after 5 seconds',
    autoHide: true,
    autoHideDelay: 5000
  }
};

export const FastTicker = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: 'Quick update: Server maintenance completed successfully',
    duration: 8000
  }
};

export const SlowTicker = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: 'This is a longer message that scrolls more slowly across the screen to give users more time to read the important information being displayed',
    duration: 35000
  }
};

export const SystemStatus = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: '🟢 All systems operational | 🔧 Scheduled maintenance: Tonight 2:00-4:00 AM EST | 📞 Support: 1-800-HELP-NOW',
    duration: 20000
  }
};

export const PromotionalMessage = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: '🛍️ LIMITED TIME: 50% OFF ALL PREMIUM FEATURES! Use code SAVE50 at checkout. Offer expires midnight tonight!',
    duration: 16000
  }
};

// Interactive demo showing multiple broadcasts
export const MultipleBroadcasts = () => {
  const [currentBroadcast, setCurrentBroadcast] = useState(null);
  
  const broadcasts = [
    { id: 1, text: 'First broadcast message - Technology news update', duration: 12000 },
    { id: 2, text: 'Second broadcast - Market updates and financial news', duration: 15000 },
    { id: 3, text: 'Third broadcast - Weather and traffic information for commuters', duration: 18000 }
  ];

  const showBroadcast = (broadcast) => {
    setCurrentBroadcast(broadcast);
  };

  const hideBroadcast = () => {
    setCurrentBroadcast(null);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '24px', color: 'var(--ink)' }}>
          Multiple Broadcast Demo
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
          {broadcasts.map((broadcast) => (
            <button
              key={broadcast.id}
              onClick={() => showBroadcast(broadcast)}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                background: currentBroadcast?.id === broadcast.id ? 'var(--ink)' : 'var(--surface)',
                color: currentBroadcast?.id === broadcast.id ? 'var(--surface)' : 'var(--ink)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Broadcast {broadcast.id}
            </button>
          ))}
          
          <button
            onClick={hideBroadcast}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              background: '#dc2626',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Hide All
          </button>
        </div>
        
        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: 0 }}>
          {currentBroadcast ? `Showing broadcast ${currentBroadcast.id}` : 'No broadcast active'}
        </p>
      </div>
      
      {currentBroadcast && (
        <BroadcastOverlay
          isVisible={true}
          text={currentBroadcast.text}
          duration={currentBroadcast.duration}
          onComplete={hideBroadcast}
        />
      )}
    </div>
  );
};

// Callback demonstration
export const WithCallbacks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [...prev.slice(-4), `${timestamp}: ${event}`]);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h3 style={{ marginBottom: '24px', color: 'var(--ink)' }}>
          Callback Events Demo
        </h3>
        
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            background: isVisible ? '#dc2626' : 'var(--ink)',
            color: 'var(--surface)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px'
          }}
        >
          {isVisible ? 'Hide Broadcast' : 'Show Broadcast'}
        </button>
        
        <div style={{ 
          background: 'var(--surface-raised)', 
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
          minHeight: '120px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
            Event Log:
          </h4>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', textAlign: 'left' }}>
            {events.length === 0 ? (
              <p style={{ margin: 0, fontStyle: 'italic' }}>No events yet...</p>
            ) : (
              events.map((event, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  {event}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <BroadcastOverlay
        isVisible={isVisible}
        text="This broadcast demonstrates callback events - watch the event log above!"
        duration={10000}
        autoHide={true}
        autoHideDelay={8000}
        onShow={() => addEvent('Broadcast shown')}
        onHide={() => {
          addEvent('Broadcast hidden');
          setIsVisible(false);
        }}
        onComplete={() => addEvent('Animation completed')}
      />
    </div>
  );
};

// Dark theme story
export const DarkTheme = {
  render: (args) => <BroadcastWrapper {...args} />,
  args: {
    text: 'Dark theme broadcast message - perfectly visible against dark backgrounds'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};
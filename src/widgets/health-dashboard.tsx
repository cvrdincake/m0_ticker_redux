import React from 'react';
import { Card } from '@/design-system/components';
import { healthMonitor, type WidgetHealthStatus } from './health';
import styles from './health-dashboard.module.css';

interface HealthIndicatorProps {
  status: WidgetHealthStatus;
  onRecover: () => void;
  onReset: () => void;
}

function HealthIndicator({ status, onRecover, onReset }: HealthIndicatorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'var(--surface-success)';
      case 'degraded': return 'var(--surface-warning)';
      case 'failed': return 'var(--surface-error)';
      case 'recovering': return 'var(--surface-info)';
      default: return 'var(--surface-secondary)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✓';
      case 'degraded': return '⚠';
      case 'failed': return '✗';
      case 'recovering': return '↻';
      default: return '?';
    }
  };

  const uptime = Date.now() - status.uptime;
  const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
  const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className={styles.healthIndicator}>
      <div className={styles.statusRow}>
        <div 
          className={styles.statusIcon}
          style={{ backgroundColor: getStatusColor(status.status) }}
        >
          {getStatusIcon(status.status)}
        </div>
        <div className={styles.widgetInfo}>
          <div className={styles.widgetId}>{status.id}</div>
          <div className={styles.widgetKind}>{status.kind}</div>
        </div>
        <div className={styles.statusText}>{status.status}</div>
      </div>
      
      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Errors:</span>
          <span className={styles.metricValue}>{status.errorCount}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Retries:</span>
          <span className={styles.metricValue}>{status.retryCount}/{status.maxRetries}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Uptime:</span>
          <span className={styles.metricValue}>{uptimeHours}h {uptimeMinutes}m</span>
        </div>
      </div>
      
      {status.lastError && (
        <div className={styles.errorRow}>
          <div className={styles.errorLabel}>Last Error:</div>
          <div className={styles.errorMessage}>{status.lastError.message}</div>
        </div>
      )}
      
      <div className={styles.actionRow}>
        {status.status !== 'healthy' && (
          <button 
            className={styles.recoverButton}
            onClick={onRecover}
            disabled={status.status === 'recovering'}
          >
            {status.status === 'recovering' ? 'Recovering...' : 'Recover'}
          </button>
        )}
        <button 
          className={styles.resetButton}
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export function HealthDashboard() {
  const [statuses, setStatuses] = React.useState<WidgetHealthStatus[]>([]);
  const [summary, setSummary] = React.useState(healthMonitor.getSummary());

  React.useEffect(() => {
    const updateHealth = () => {
      setStatuses(healthMonitor.getAllStatuses());
      setSummary(healthMonitor.getSummary());
    };

    // Initial load
    updateHealth();

    // Subscribe to changes
    const unsubscribe = healthMonitor.subscribe(updateHealth);

    // Periodic updates
    const interval = setInterval(updateHealth, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleRecover = React.useCallback((widgetId: string) => {
    healthMonitor.recover(widgetId);
  }, []);

  const handleReset = React.useCallback((widgetId: string) => {
    healthMonitor.reset(widgetId);
  }, []);

  const handleRecoverAll = React.useCallback(() => {
    const unhealthyWidgets = statuses.filter(s => 
      s.status === 'failed' || s.status === 'degraded'
    );
    unhealthyWidgets.forEach(s => healthMonitor.recover(s.id));
  }, [statuses]);

  const handleResetAll = React.useCallback(() => {
    statuses.forEach(s => healthMonitor.reset(s.id));
  }, [statuses]);

  if (statuses.length === 0) {
    return (
      <Card className={styles.healthDashboard}>
        <div className={styles.emptyState}>
          <div>No widgets are currently being monitored</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={styles.healthDashboard}>
      <div className={styles.header}>
        <h3>Widget Health Monitor</h3>
        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={handleRecoverAll}
            disabled={summary.degraded + summary.failed === 0}
          >
            Recover All
          </button>
          <button 
            className={styles.actionButton}
            onClick={handleResetAll}
          >
            Reset All
          </button>
        </div>
      </div>
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue}>{summary.total}</div>
          <div className={styles.summaryLabel}>Total</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue} style={{ color: 'var(--ink-success)' }}>
            {summary.healthy}
          </div>
          <div className={styles.summaryLabel}>Healthy</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue} style={{ color: 'var(--ink-warning)' }}>
            {summary.degraded}
          </div>
          <div className={styles.summaryLabel}>Degraded</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue} style={{ color: 'var(--ink-error)' }}>
            {summary.failed}
          </div>
          <div className={styles.summaryLabel}>Failed</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue} style={{ color: 'var(--ink-info)' }}>
            {summary.recovering}
          </div>
          <div className={styles.summaryLabel}>Recovering</div>
        </div>
      </div>
      
      <div className={styles.widgetList}>
        {statuses.map(status => (
          <HealthIndicator
            key={status.id}
            status={status}
            onRecover={() => handleRecover(status.id)}
            onReset={() => handleReset(status.id)}
          />
        ))}
      </div>
    </Card>
  );
}
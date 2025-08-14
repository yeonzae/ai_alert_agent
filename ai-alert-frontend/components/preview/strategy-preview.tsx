'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useStrategyStore } from '../../store';
import { Strategy, StrategyNode } from '../../types/strategy';

export function StrategyPreview() {
  const { currentStrategy, confidence, warnings, suggestions, clearStrategy } = useStrategyStore();

  if (!currentStrategy) {
    return null;
  }

  const triggerNodes = currentStrategy.nodes?.filter(node => node.type === 'trigger') || [];
  const filterNodes = currentStrategy.nodes?.filter(node => node.type === 'filter') || [];
  const actionNodes = currentStrategy.nodes?.filter(node => node.type === 'action') || [];

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-4">
      {/* Strategy Header */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{currentStrategy.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Confidence:</span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearStrategy}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear
              </Button>
            </div>
          </div>
          {currentStrategy.description && (
            <p className="text-sm text-gray-600">{currentStrategy.description}</p>
          )}
        </CardHeader>
      </Card>

      {/* Strategy Components */}
      <div className="space-y-3">
        {/* Triggers */}
        {triggerNodes.map((node, index) => (
          <NodeCard key={node.id} node={node} type="trigger" index={index} />
        ))}

        {/* Filters */}
        {filterNodes.map((node, index) => (
          <NodeCard key={node.id} node={node} type="filter" index={index} />
        ))}

        {/* Actions */}
        {actionNodes.map((node, index) => (
          <NodeCard key={node.id} node={node} type="action" index={index} />
        ))}

        {/* Risk Settings */}
        {currentStrategy.risk && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-800">🛡️ Risk Management</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Cooldown:</span>
                  <span className="ml-2 font-medium">{currentStrategy.risk.cooldown_minutes} min</span>
                </div>
                <div>
                  <span className="text-gray-600">Max daily alerts:</span>
                  <span className="ml-2 font-medium">{currentStrategy.risk.max_alerts_per_day}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Warnings and Suggestions */}
      {(warnings.length > 0 || suggestions.length > 0) && (
        <div className="space-y-3">
          {warnings.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-yellow-800">⚠️ Warnings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-yellow-700 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {suggestions.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-800">💡 Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-blue-700 space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button variant="primary" className="flex-1">
          Save Strategy
        </Button>
        <Button variant="secondary" className="flex-1">
          Create Agent
        </Button>
      </div>
    </div>
  );
}

function NodeCard({ node, type, index }: { node: StrategyNode; type: string; index: number }) {
  const condition = node.condition as any;
  
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'trigger':
        return { emoji: '⚡', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' };
      case 'filter':
        return { emoji: '🔍', bgColor: 'bg-teal-50', borderColor: 'border-teal-200', textColor: 'text-teal-800' };
      case 'action':
        return { emoji: '📢', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' };
      default:
        return { emoji: '❓', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-800' };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Card className={`${config.bgColor} ${config.borderColor}`}>
      <CardContent className="pt-4">
        <div className="flex items-start space-x-3">
          <div className="text-lg">{config.emoji}</div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${config.textColor} capitalize mb-1`}>
              {type} {index + 1}
            </div>
            <div className="text-sm text-gray-700">
              {formatCondition(condition, type)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatCondition(condition: any, type: string): string {
  if (!condition) return 'No condition specified';

  switch (type) {
    case 'trigger':
      if (condition.type === 'price') {
        const direction = condition.direction === 'up' ? 'increases' : 'decreases';
        return `When ${condition.asset || condition.symbol} ${direction} by ${Math.abs(condition.change_pct || 0)}% in ${condition.timeframe}`;
      }
      break;
    case 'filter':
      if (condition.type === 'volume') {
        return `Only when volume is ${condition.volume_threshold}% of average`;
      } else if (condition.type === 'time') {
        return `Only between ${condition.time_start} and ${condition.time_end}`;
      }
      break;
    case 'action':
      if (condition.type === 'telegram') {
        return `Send Telegram message: "${condition.message_template}"`;
      } else if (condition.type === 'webhook') {
        return `Call webhook: ${condition.webhook_url}`;
      }
      break;
  }

  return `${condition.type} condition`;
}
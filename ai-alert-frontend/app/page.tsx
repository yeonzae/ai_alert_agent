import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            AI Alert Agent
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create intelligent investment alerts using natural language. 
            No coding required - just describe what you want to monitor.
          </p>
          <Link href="/strategies/new">
            <Button variant="primary" size="lg" className="text-lg px-8 py-4">
              Create Your First Alert 🚀
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card glass className="text-center">
            <CardHeader>
              <div className="text-4xl mb-2">🤖</div>
              <CardTitle>AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Describe your alert strategy in plain English. 
                Our AI converts it to a working monitoring system.
              </p>
            </CardContent>
          </Card>

          <Card glass className="text-center">
            <CardHeader>
              <div className="text-4xl mb-2">📊</div>
              <CardTitle>Real-time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor stocks, crypto, and market conditions 24/7. 
                Get notified instantly when your conditions are met.
              </p>
            </CardContent>
          </Card>

          <Card glass className="text-center">
            <CardHeader>
              <div className="text-4xl mb-2">⚡</div>
              <CardTitle>Instant Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Receive notifications via Telegram, webhook, or other channels 
                the moment your strategy triggers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Example Strategies */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Popular Alert Strategies
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="text-left">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-2">Price Alert</div>
                <p className="font-medium mb-2">
                  "Alert me when Bitcoin goes up 5% in an hour"
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <span className="mr-1">✓</span>
                  Price monitoring + Telegram alerts
                </div>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-2">Volume + Price</div>
                <p className="font-medium mb-2">
                  "Notify when Tesla drops 3% with high volume"
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <span className="mr-1">✓</span>
                  Multi-condition filtering
                </div>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-2">Technical Analysis</div>
                <p className="font-medium mb-2">
                  "Alert when Ethereum RSI drops below 30"
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <span className="mr-1">✓</span>
                  Technical indicators
                </div>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-2">Risk Management</div>
                <p className="font-medium mb-2">
                  "Stop loss alert at 5% down, max 3 per day"
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <span className="mr-1">✓</span>
                  Built-in risk controls
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/strategies/new">
            <Button variant="secondary" size="lg">
              Start Building Alerts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  GitBranch,
  Plus,
  Trash2,
  Edit,
  Play,
  Pause,
  AlertCircle,
  Zap,
  ThermometerSun,
  Clock,
  Power,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  condition: {
    type: 'energy' | 'temperature' | 'time' | 'device';
    operator: 'greater' | 'less' | 'equals' | 'between';
    value: string | number;
    value2?: string | number;
  };
  action: {
    type: 'device' | 'notification' | 'alert';
    target: string;
    operation: 'on' | 'off' | 'notify' | 'alert';
  };
  createdAt: string;
  lastTriggered?: string;
}

const Automation: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'High Consumption Alert',
      description: 'Alert when consumption exceeds 5000 kWh',
      enabled: true,
      condition: {
        type: 'energy',
        operator: 'greater',
        value: 5000,
      },
      action: {
        type: 'notification',
        target: 'admin',
        operation: 'alert',
      },
      createdAt: '2024-01-15T08:00:00.000Z',
      lastTriggered: '2024-01-20T14:30:00.000Z',
    },
    {
      id: '2',
      name: 'Night Mode - Auto Off',
      description: 'Turn off non-essential devices at 10 PM',
      enabled: true,
      condition: {
        type: 'time',
        operator: 'equals',
        value: '22:00',
      },
      action: {
        type: 'device',
        target: 'Non-Essential Lights',
        operation: 'off',
      },
      createdAt: '2024-01-10T10:00:00.000Z',
      lastTriggered: '2024-01-20T22:00:00.000Z',
    },
    {
      id: '3',
      name: 'Temperature Control',
      description: 'Turn on AC when temperature > 28°C',
      enabled: false,
      condition: {
        type: 'temperature',
        operator: 'greater',
        value: 28,
      },
      action: {
        type: 'device',
        target: 'AC Unit',
        operation: 'on',
      },
      createdAt: '2024-01-05T09:00:00.000Z',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    toast({
      title: 'Rule Updated',
      description: 'Automation rule has been toggled',
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
    toast({
      title: 'Rule Deleted',
      description: 'Automation rule has been deleted',
      variant: 'destructive',
    });
  };

  const handleEditRule = (rule: AutomationRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  const getConditionIcon = (type: string) => {
    switch (type) {
      case 'energy':
        return <Zap className="h-4 w-4" />;
      case 'temperature':
        return <ThermometerSun className="h-4 w-4" />;
      case 'time':
        return <Clock className="h-4 w-4" />;
      case 'device':
        return <Power className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCondition = (condition: AutomationRule['condition']) => {
    const operatorText = {
      greater: '>',
      less: '<',
      equals: '=',
      between: 'between',
    };

    return `${condition.type.toUpperCase()} ${operatorText[condition.operator]} ${condition.value}${condition.value2 ? ` and ${condition.value2}` : ''}`;
  };

  const formatAction = (action: AutomationRule['action']) => {
    return `${action.operation.toUpperCase()} ${action.target}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <GitBranch className="h-8 w-8" />
              IF-THEN Automation
            </h1>
            <p className="text-muted-foreground mt-1">
              Create automated rules to control devices and receive alerts
            </p>
          </div>
          <Button onClick={handleCreateRule}>
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>

        {/* Admin Only Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Admin Only Feature:</strong> Automation rules can only be created, edited, and deleted by administrators.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rules.length}</div>
              <p className="text-xs text-muted-foreground">
                {rules.filter((r) => r.enabled).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
              <Play className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {rules.filter((r) => r.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Rules</CardTitle>
              <Pause className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {rules.filter((r) => !r.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">Paused</p>
            </CardContent>
          </Card>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className={!rule.enabled ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{rule.name}</CardTitle>
                      <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="text-muted-foreground">IF</span>
                      {getConditionIcon(rule.condition.type)}
                      Condition
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm">{formatCondition(rule.condition)}</code>
                    </div>
                  </div>

                  <div className="text-2xl text-muted-foreground">→</div>

                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="text-muted-foreground">THEN</span>
                      <Zap className="h-4 w-4" />
                      Action
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm">{formatAction(rule.action)}</code>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="space-y-1">
                    <div>Created: {new Date(rule.createdAt).toLocaleString()}</div>
                    {rule.lastTriggered && (
                      <div>
                        Last Triggered: {new Date(rule.lastTriggered).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Edit Automation Rule' : 'Create New Rule'}
              </DialogTitle>
              <DialogDescription>
                Define conditions and actions for automated device control
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input id="name" placeholder="e.g., Night Mode Auto Off" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of what this rule does"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Condition (IF)</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Condition Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="energy">Energy Consumption</SelectItem>
                        <SelectItem value="temperature">Temperature</SelectItem>
                        <SelectItem value="time">Time</SelectItem>
                        <SelectItem value="device">Device Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greater">Greater than (&gt;)</SelectItem>
                        <SelectItem value="less">Less than (&lt;)</SelectItem>
                        <SelectItem value="equals">Equals (=)</SelectItem>
                        <SelectItem value="between">Between</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input type="number" placeholder="e.g., 5000" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Action (THEN)</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Action Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="device">Control Device</SelectItem>
                        <SelectItem value="notification">Send Notification</SelectItem>
                        <SelectItem value="alert">Create Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target</Label>
                    <Input placeholder="Device name or recipient" />
                  </div>

                  <div className="space-y-2">
                    <Label>Operation</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on">Turn On</SelectItem>
                        <SelectItem value="off">Turn Off</SelectItem>
                        <SelectItem value="notify">Notify</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: editingRule ? 'Rule Updated' : 'Rule Created',
                    description: editingRule
                      ? 'Automation rule has been updated'
                      : 'New automation rule has been created',
                  });
                  setIsDialogOpen(false);
                }}
              >
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Automation;

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Scale, Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';

interface LegalInfo {
  businessName: string;
  structure: string;
  registrationNumber: string;
  country: string;
  contactEmail: string;
  notes: string;
}

const KEY = 'profitmate_legal_info';

const defaults: LegalInfo = {
  businessName: '',
  structure: '',
  registrationNumber: '',
  country: '',
  contactEmail: '',
  notes: '',
};

function load(): LegalInfo {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch { return defaults; }
}

const LegalSection = () => {
  const [info, setInfo] = useState<LegalInfo>(load);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<LegalInfo>(info);

  useEffect(() => { setDraft(info); }, [info]);

  const handleSave = () => {
    localStorage.setItem(KEY, JSON.stringify(draft));
    setInfo(draft);
    setEditing(false);
    toast.success('Legal info saved');
  };

  const hasInfo = Object.values(info).some(v => v.trim() !== '');

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          Legal & About
        </CardTitle>
        {!editing ? (
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="h-8 px-2">
            <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
        ) : (
          <Button size="sm" onClick={handleSave} className="h-8 px-2 gradient-primary text-primary-foreground border-0">
            <Save className="w-3.5 h-3.5 mr-1" /> Save
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          ProfitMate is software for tracking sales, expenses, and profit. It has no legal structure of its own — register your business locally and add the details here so they show in your reports.
        </p>

        {editing ? (
          <div className="space-y-2">
            <Input placeholder="Business name" value={draft.businessName} onChange={e => setDraft({ ...draft, businessName: e.target.value })} />
            <Input placeholder="Legal structure (e.g. Sole Proprietor, Ltd, Cooperative)" value={draft.structure} onChange={e => setDraft({ ...draft, structure: e.target.value })} />
            <Input placeholder="Registration number" value={draft.registrationNumber} onChange={e => setDraft({ ...draft, registrationNumber: e.target.value })} />
            <Input placeholder="Country / authority (e.g. RDB Rwanda)" value={draft.country} onChange={e => setDraft({ ...draft, country: e.target.value })} />
            <Input placeholder="Contact email" value={draft.contactEmail} onChange={e => setDraft({ ...draft, contactEmail: e.target.value })} />
            <Textarea placeholder="Other notes (tax ID, address...)" rows={3} value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} />
          </div>
        ) : hasInfo ? (
          <dl className="text-sm space-y-1.5">
            {info.businessName && <Row label="Business" value={info.businessName} />}
            {info.structure && <Row label="Structure" value={info.structure} />}
            {info.registrationNumber && <Row label="Reg. No." value={info.registrationNumber} />}
            {info.country && <Row label="Authority" value={info.country} />}
            {info.contactEmail && <Row label="Email" value={info.contactEmail} />}
            {info.notes && <Row label="Notes" value={info.notes} />}
          </dl>
        ) : (
          <p className="text-xs italic text-muted-foreground">No business details added yet. Tap Edit to add them.</p>
        )}
      </CardContent>
    </Card>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2">
    <dt className="text-xs font-medium text-muted-foreground min-w-[80px]">{label}:</dt>
    <dd className="text-xs text-foreground flex-1 break-words">{value}</dd>
  </div>
);

export default LegalSection;

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  open: boolean;
  onAccept: () => void;
  onClose?: () => void;
  requireAcceptance?: boolean;
}

export const PrivacyPolicyContent = () => (
  <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
    <section>
      <h3 className="font-semibold text-base mb-1">1. Introduction</h3>
      <p>
        Welcome to ProfitMate. Your privacy matters to us. This Privacy Policy explains
        how we collect, use, store and protect your information when you use our
        application designed for small businesses across East Africa.
      </p>
    </section>
    <section>
      <h3 className="font-semibold text-base mb-1">2. Information We Collect</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Account info: email address, name, and authentication identifiers.</li>
        <li>Business data you enter: products, inventory, sales, expenses, and notes.</li>
        <li>Device data: language preference, currency, and theme.</li>
      </ul>
    </section>
    <section>
      <h3 className="font-semibold text-base mb-1">3. How We Use Your Information</h3>
      <p>
        We use your data to provide the app's core features — tracking sales, expenses,
        inventory, generating reports, and sending you helpful notifications about your
        business (e.g. low stock alerts).
      </p>
    </section>
    <section>
      <h3 className="font-semibold text-base mb-1">4. Data Storage & Offline Use</h3>
      <p>
        Your data is securely stored in our cloud backend and also cached on your device
        so the app works offline. Only you can access your own business records.
      </p>
    </section>
    <section>
      <h3 className="font-semibold text-base mb-1">5. Sharing</h3>
      <p>
        We do not sell or share your personal data with third parties. We only share
        data when required by law.
      </p>
    </section>
    <section>
      <h3 className="font-semibold text-base mb-1">6. Your Rights</h3>
      <p>
        You can request to view, edit, or delete your data at any time by contacting us
        through the Help & Feedback page.
      </p>
    </section>
    <section>
      <h3 className="font-semibold text-base mb-1">7. Security</h3>
      <p>
        We use industry-standard security including encrypted connections and
        role-based access control to protect your information.
      </p>
    </section>
    <section>
      <h3 className="font-semibold text-base mb-1">8. Contact</h3>
      <p>
        For any privacy concerns, reach out via the Help & Feedback page inside the app.
      </p>
    </section>
    <p className="text-xs text-muted-foreground pt-2">
      Last updated: {new Date().toLocaleDateString()}
    </p>
  </div>
);

const PrivacyPolicy = ({ open, onAccept, onClose, requireAcceptance = true }: PrivacyPolicyProps) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && onClose && !requireAcceptance) onClose(); }}>
      <DialogContent
        className="max-w-lg max-h-[85vh] flex flex-col"
        onPointerDownOutside={(e) => { if (requireAcceptance) e.preventDefault(); }}
        onEscapeKeyDown={(e) => { if (requireAcceptance) e.preventDefault(); }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Please read and agree to our Privacy Policy before using ProfitMate.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-3 -mr-3 max-h-[50vh]">
          <PrivacyPolicyContent />
        </ScrollArea>
        {requireAcceptance ? (
          <DialogFooter className="flex-col gap-3 sm:flex-col">
            <label className="flex items-start gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5"
              />
              <span>I have read and agree to the Privacy Policy.</span>
            </label>
            <Button
              className="w-full gradient-primary"
              disabled={!agreed}
              onClick={onAccept}
            >
              Accept & Continue
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;

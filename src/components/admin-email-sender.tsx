"use client";

import React, { useState, useMemo } from "react";
import {
  IconSend,
  IconLoader2,
  IconPlus,
  IconTrash,
  IconUsers,
  IconUser,
  IconTemplate,
  IconEye,
  IconHistory,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  founderMessageEmail,
  EMAIL_TEMPLATES,
} from "@/src/emails/manual/founder-message";

interface User {
  id: string;
  username: string;
}

interface ChangelogItem {
  type: "new" | "fix" | "improvement";
  text: string;
}

interface SentEmail {
  id: string;
  subject: string;
  greeting: string | null;
  message: string;
  sign_off: string | null;
  founder_name: string | null;
  cta_text: string | null;
  cta_url: string | null;
  changelog: ChangelogItem[] | null;
  recipient_type: string;
  recipient_count: number;
  sent_at: string;
}

interface AdminEmailSenderProps {
  users: User[];
  sentEmails: SentEmail[];
}

export default function AdminEmailSender({
  users,
  sentEmails,
}: AdminEmailSenderProps) {
  // Form state
  const [selectedTemplate, setSelectedTemplate] = useState<string>("custom");
  const [subject, setSubject] = useState("A message from JustReel 💚");
  const [greeting, setGreeting] = useState("Hey {{username}} 👋");
  const [message, setMessage] = useState("");
  const [signOff, setSignOff] = useState("Thank you for being awesome!");
  const [founderName, setFounderName] = useState("KingArthur");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [changelog, setChangelog] = useState<ChangelogItem[]>([]);

  // Recipient state
  const [recipientType, setRecipientType] = useState<"all" | "single">(
    "single",
  );
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userSearch, setUserSearch] = useState("");

  // UI state
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!userSearch) return users.slice(0, 20);
    return users
      .filter((u) =>
        u.username.toLowerCase().includes(userSearch.toLowerCase()),
      )
      .slice(0, 20);
  }, [users, userSearch]);

  // Get selected user
  const selectedUser = users.find((u) => u.id === selectedUserId);

  // Generate preview HTML
  const previewHtml = useMemo(() => {
    const previewUsername = selectedUser?.username || "Username";
    const { html } = founderMessageEmail({
      username: previewUsername,
      subject,
      greeting: greeting.replace("{{username}}", previewUsername),
      message,
      signOff,
      founderName,
      changelog: changelog.length > 0 ? changelog : undefined,
      ctaText: ctaText || undefined,
      ctaUrl: ctaUrl || undefined,
    });
    return html;
  }, [
    subject,
    greeting,
    message,
    signOff,
    founderName,
    changelog,
    ctaText,
    ctaUrl,
    selectedUser,
  ]);

  // Load template
  const loadTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === "custom") return;

    const template = Object.values(EMAIL_TEMPLATES).find(
      (t) => t.id === templateId,
    );
    if (template) {
      setSubject(template.defaults.subject);
      setGreeting(template.defaults.greeting);
      setMessage(template.defaults.message);
      setSignOff(template.defaults.signOff);
      if ("ctaText" in template.defaults) {
        setCtaText(template.defaults.ctaText || "");
        setCtaUrl(template.defaults.ctaUrl || "");
      } else {
        setCtaText("");
        setCtaUrl("");
      }
    }
  };

  // Load from previous email
  const loadFromHistory = (emailId: string) => {
    const email = sentEmails.find((e) => e.id === emailId);
    if (!email) return;

    setSelectedTemplate("custom");
    setSubject(email.subject);
    setGreeting(email.greeting || "Hey {{username}} 👋");
    setMessage(email.message);
    setSignOff(email.sign_off || "Thanks for being awesome!");
    setFounderName(email.founder_name || "Arthur");
    setCtaText(email.cta_text || "");
    setCtaUrl(email.cta_url || "");
    setChangelog(email.changelog || []);
    toast.success("Loaded from previous email");
  };

  // Add changelog item
  const addChangelogItem = () => {
    setChangelog([...changelog, { type: "new", text: "" }]);
  };

  // Update changelog item
  const updateChangelogItem = (
    index: number,
    field: "type" | "text",
    value: string,
  ) => {
    const newChangelog = [...changelog];
    if (field === "type") {
      newChangelog[index].type = value as ChangelogItem["type"];
    } else {
      newChangelog[index].text = value;
    }
    setChangelog(newChangelog);
  };

  // Remove changelog item
  const removeChangelogItem = (index: number) => {
    setChangelog(changelog.filter((_, i) => i !== index));
  };

  // Send email
  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (recipientType === "single" && !selectedUserId) {
      toast.error("Please select a recipient");
      return;
    }

    const confirmMessage =
      recipientType === "all"
        ? `Send this email to ALL ${users.length} users?`
        : `Send this email to ${selectedUser?.username}?`;

    if (!confirm(confirmMessage)) return;

    setIsSending(true);
    const toastId = toast.loading(
      recipientType === "all"
        ? `Sending to ${users.length} users...`
        : "Sending email...",
    );

    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientType,
          recipientId: recipientType === "single" ? selectedUserId : undefined,
          emailData: {
            subject,
            greeting,
            message,
            signOff,
            founderName,
            changelog: changelog.length > 0 ? changelog : undefined,
            ctaText: ctaText || undefined,
            ctaUrl: ctaUrl || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast.success(
        `Email sent successfully to ${data.sentCount} user${data.sentCount !== 1 ? "s" : ""}`,
        { id: toastId },
      );
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send email",
        { id: toastId },
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor Panel */}
      <div className="space-y-6">
        {/* Template Selection */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IconTemplate size={20} />
            Template
          </h2>
          <select
            value={selectedTemplate}
            onChange={(e) => loadTemplate(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200"
          >
            <option value="custom">Custom Message</option>
            {Object.values(EMAIL_TEMPLATES).map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.description}
              </option>
            ))}
          </select>
        </div>

        {/* Previous Emails */}
        {sentEmails.length > 0 && (
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <IconHistory size={20} />
              Previous Emails
            </h2>
            <select
              onChange={(e) => {
                if (e.target.value) loadFromHistory(e.target.value);
                e.target.value = "";
              }}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200"
              defaultValue=""
            >
              <option value="" disabled>
                Load from a previous email...
              </option>
              {sentEmails.map((email) => (
                <option key={email.id} value={email.id}>
                  {email.subject} (
                  {new Date(email.sent_at).toLocaleDateString()} -{" "}
                  {email.recipient_type === "all"
                    ? `All users (${email.recipient_count})`
                    : "Single user"}
                  )
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Message Content */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Message Content</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200"
                placeholder="Email subject..."
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Greeting (use {"{{username}}"} for personalization)
              </label>
              <input
                type="text"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200"
                placeholder="Hey {{username}} 👋"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Message (separate paragraphs with blank lines)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200 resize-y"
                placeholder="Your message here..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Sign Off
                </label>
                <input
                  type="text"
                  value={signOff}
                  onChange={(e) => setSignOff(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200"
                  placeholder="Thanks for being awesome!"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200"
                  placeholder="Arthur"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  CTA Button Text (optional)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200"
                  placeholder="Explore JustReel"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  CTA Button URL
                </label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200"
                  placeholder="https://justreel.app"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Changelog Section */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">What's New (optional)</h2>
            <button
              onClick={addChangelogItem}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-lime-400 text-neutral-900 rounded-lg hover:bg-lime-500 transition-colors"
            >
              <IconPlus size={16} />
              Add Item
            </button>
          </div>

          {changelog.length === 0 ? (
            <p className="text-neutral-500 text-sm">
              No changelog items. Click "Add Item" to include updates.
            </p>
          ) : (
            <div className="space-y-3">
              {changelog.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    value={item.type}
                    onChange={(e) =>
                      updateChangelogItem(index, "type", e.target.value)
                    }
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-200 text-sm"
                  >
                    <option value="new">✨ New</option>
                    <option value="fix">🔧 Fix</option>
                    <option value="improvement">⚡ Improvement</option>
                  </select>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      updateChangelogItem(index, "text", e.target.value)
                    }
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-200 text-sm"
                    placeholder="Description of the change..."
                  />
                  <button
                    onClick={() => removeChangelogItem(index)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recipients */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Recipients</h2>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setRecipientType("single")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                recipientType === "single"
                  ? "bg-lime-400/10 border-lime-400 text-lime-400"
                  : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              <IconUser size={20} />
              Single User
            </button>
            <button
              onClick={() => setRecipientType("all")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                recipientType === "all"
                  ? "bg-red-400/10 border-red-400 text-red-400"
                  : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              <IconUsers size={20} />
              All Users ({users.length})
            </button>
          </div>

          {recipientType === "single" && (
            <div>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200 mb-3"
                placeholder="Search users..."
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedUserId === user.id
                        ? "bg-lime-400/10 text-lime-400"
                        : "hover:bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    {user.username}
                  </button>
                ))}
              </div>
              {selectedUser && (
                <p className="mt-3 text-sm text-neutral-400">
                  Selected:{" "}
                  <span className="text-lime-400">{selectedUser.username}</span>
                </p>
              )}
            </div>
          )}

          {recipientType === "all" && (
            <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">
                ⚠️ This will send an email to{" "}
                <strong>all {users.length} users</strong>. Make sure your
                message is ready!
              </p>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isSending || !message.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-lime-400 text-neutral-900 font-semibold rounded-lg hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <IconLoader2 size={20} className="animate-spin" />
          ) : (
            <IconSend size={20} />
          )}
          {isSending ? "Sending..." : "Send Email"}
        </button>
      </div>

      {/* Preview Panel */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <h2 className="font-semibold flex items-center gap-2">
              <IconEye size={18} />
              Preview
            </h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-neutral-400 hover:text-neutral-200"
            >
              {showPreview ? "Hide" : "Show"}
            </button>
          </div>
          {showPreview && (
            <div className="p-4">
              <div className="mb-3 text-sm">
                <span className="text-neutral-500">Subject:</span>{" "}
                <span className="text-neutral-200">{subject}</span>
              </div>
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  transform: "scale(0.85)",
                  transformOrigin: "top left",
                  width: "117.6%",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

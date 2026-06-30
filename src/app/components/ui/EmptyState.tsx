import { ReactNode } from "react";
import { Link } from "react-router";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: any;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  actionLink,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-xl border border-border text-center shadow-md max-w-md mx-auto">
      <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center text-primary mb-4">
        <Icon className="w-8 h-8 text-accent" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      )}
      {children}
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          {actionText}
        </Link>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

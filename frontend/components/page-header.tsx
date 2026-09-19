import { ArrowRightIcon } from './icons';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  actionHref
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {action && actionHref ? <a className="secondary-button" href={actionHref}>{action}<ArrowRightIcon size={14} /></a> : null}
    </header>
  );
}

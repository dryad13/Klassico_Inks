import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ki-yellow focus-visible:ring-offset-2';

export function Section({ tone = 'dark', className, children, id, ...rest }) {
  return (
    <section
      id={id}
      data-v2-tone={tone}
      className={clsx(
        tone === 'paper' ? 'bg-ki-paper text-ki-ground' : 'bg-ki-ground text-white',
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

export function Container({ className, children }) {
  return <div className={clsx('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

export function Card({ tone = 'dark', className, children, ...rest }) {
  return (
    <div
      data-v2-tone={tone === 'paper' ? 'paper' : undefined}
      className={clsx(
        'rounded-2xl border',
        tone === 'paper'
          ? 'bg-white/70 border-ki-green/20 shadow-sm'
          : 'bg-slate-800/50 border-slate-700/60',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Chip({ tone = 'dark', className, children }) {
  return (
    <span
      className={clsx(
        'inline-block py-1 px-3 rounded-full text-sm font-medium border',
        tone === 'paper'
          ? 'bg-white text-ki-green border-ki-green/30'
          : 'bg-ki-green/20 text-ki-orange border-ki-green/40',
        className
      )}
    >
      {children}
    </span>
  );
}

const buttonVariants = {
  primary:
    'bg-ki-orange hover:bg-[#e0841a] text-ki-ground font-bold shadow-lg shadow-ki-orange/20',
  secondary:
    'bg-transparent border border-ki-green text-ki-green hover:bg-ki-green hover:text-white font-medium',
  ghost:
    'bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 font-medium',
  paperGhost:
    'bg-white hover:bg-ki-paper text-ki-ground border border-ki-green/25 font-medium',
};

export function Button({
  to,
  href,
  variant = 'primary',
  className,
  children,
  onClick,
  type = 'button',
  ...rest
}) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg transition-colors',
    focusRing,
    variant === 'primary' || variant === 'secondary'
      ? 'focus-visible:ring-offset-ki-ground'
      : 'focus-visible:ring-offset-ki-paper',
    buttonVariants[variant] || buttonVariants.primary,
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export function PageHeader({ tone = 'dark', eyebrow, title, description, icon: Icon }) {
  const isPaper = tone === 'paper';
  return (
    <div
      data-v2-tone={tone}
      className={clsx(
        'py-16 md:py-20 border-b',
        isPaper ? 'bg-ki-paper border-ki-green/15' : 'bg-slate-950 border-slate-800'
      )}
    >
      <Container className="text-center">
        {Icon && (
          <Icon
            className={clsx('h-12 w-12 mx-auto mb-4', isPaper ? 'text-ki-orange' : 'text-ki-orange')}
            aria-hidden="true"
          />
        )}
        {eyebrow && <Chip tone={tone} className="mb-4">{eyebrow}</Chip>}
        <h1
          className={clsx(
            'text-4xl md:text-5xl font-bold font-heading mb-4 tracking-tight',
            isPaper ? 'text-ki-ground' : 'text-white'
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={clsx(
              'max-w-2xl mx-auto text-lg leading-[1.65]',
              isPaper ? 'text-slate-700' : 'text-slate-300'
            )}
          >
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}


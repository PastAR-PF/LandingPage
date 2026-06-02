'use client';
import React, { useState, Children, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stepVariants = {
  enter: dir => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: dir => ({ x: dir >= 0 ? '50%' : '-50%', opacity: 0 }),
};

function SlideTransition({ children, direction, onHeightReady }) {
  const ref = useRef(null);
  useLayoutEffect(() => { if (ref.current) onHeightReady(ref.current.offsetHeight); }, [children, onHeightReady]);
  return (
    <motion.div ref={ref} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit"
      transition={{ duration: 0.4 }} style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
      {children}
    </motion.div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [h, setH] = useState(0);
  return (
    <motion.div style={{ position: 'relative', overflow: 'hidden' }} animate={{ height: isCompleted ? 0 : h }}
      transition={{ type: 'spring', duration: 0.4 }} className={className}>
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && <SlideTransition key={currentStep} direction={direction} onHeightReady={setH}>{children}</SlideTransition>}
      </AnimatePresence>
    </motion.div>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, ease: 'easeOut', duration: 0.3 }}
        strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StepIndicator({ step, currentStep, onClickStep }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  return (
    <motion.div onClick={() => step !== currentStep && onClickStep(step)} style={{ cursor: 'pointer', position: 'relative' }} animate={status} initial={false}>
      <motion.div
        variants={{
          inactive: { backgroundColor: '#E4E7E2', color: '#7A9085' },
          active: { backgroundColor: '#1A5C38', color: '#FFFFFF' },
          complete: { backgroundColor: '#3A8A58', color: '#FFFFFF' },
        }}
        transition={{ duration: 0.3 }}
        style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}
      >
        {status === 'complete' ? <CheckIcon style={{ width: 16, height: 16, color: '#fff' }} />
          : status === 'active' ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4EDD9' }} />
          : <span>{step}</span>}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div style={{ flex: 1, height: 2, borderRadius: 4, background: '#E4E7E2', position: 'relative', overflow: 'hidden', margin: '0 8px' }}>
      <motion.div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#3A8A58' }}
        variants={{ incomplete: { width: 0 }, complete: { width: '100%' } }}
        initial={false} animate={isComplete ? 'complete' : 'incomplete'} transition={{ duration: 0.4 }} />
    </div>
  );
}

export function Step({ children }) { return <div>{children}</div>; }

export default function Stepper({
  children, initialStep = 1, onStepChange, onFinalStepCompleted,
  backButtonText = 'Atrás', nextButtonText = 'Siguiente',
  stepCircleContainerClassName = '', contentClassName = '', footerClassName = '',
  backButtonProps = {}, nextButtonProps = {},
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const total = stepsArray.length;
  const isCompleted = currentStep > total;
  const isLast = currentStep === total;

  const updateStep = (n) => { setCurrentStep(n); if (n > total) onFinalStepCompleted?.(); else onStepChange?.(n); };
  const handleBack = () => { if (currentStep > 1) { setDirection(-1); updateStep(currentStep - 1); } };
  const handleNext = () => { if (!isLast) { setDirection(1); updateStep(currentStep + 1); } };
  const handleComplete = () => { setDirection(1); updateStep(total + 1); };

  return (
    <div style={{ width: '100%' }}>
      {/* Step indicators */}
      <div className={stepCircleContainerClassName} style={{ display: 'flex', alignItems: 'center', padding: '0 0 32px 0' }}>
        {stepsArray.map((_, i) => {
          const n = i + 1;
          return (
            <React.Fragment key={n}>
              <StepIndicator step={n} currentStep={currentStep} onClickStep={clicked => { setDirection(clicked > currentStep ? 1 : -1); updateStep(clicked); }} />
              {i < total - 1 && <StepConnector isComplete={currentStep > n} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Content */}
      <StepContentWrapper isCompleted={isCompleted} currentStep={currentStep} direction={direction} className={contentClassName}>
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>

      {/* Footer */}
      {!isCompleted && (
        <div className={footerClassName} style={{ display: 'flex', justifyContent: currentStep !== 1 ? 'space-between' : 'flex-end', marginTop: 32 }}>
          {currentStep !== 1 && (
            <button onClick={handleBack} {...backButtonProps}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'transparent', color: '#7A9085', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem', ...backButtonProps.style }}>
              {backButtonText}
            </button>
          )}
          <button onClick={isLast ? handleComplete : handleNext} {...nextButtonProps}
            style={{ padding: '10px 24px', borderRadius: 999, border: 'none', background: '#1A5C38', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem', transition: 'background 0.15s', ...nextButtonProps.style }}>
            {isLast ? 'Completar' : nextButtonText}
          </button>
        </div>
      )}
    </div>
  );
}

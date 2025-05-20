import { useFloating, useHover, useInteractions, offset, flip, shift } from '@floating-ui/react';
import { useState } from 'react';

const Tooltip = ({ children, content }) => {
     const [isOpen, setIsOpen] = useState(false);
     const { refs, floatingStyles, context } = useFloating({
          open: isOpen,
          onOpenChange: setIsOpen,
          placement: 'top',
          middleware: [offset(5), flip(), shift()]
     });

     const hover = useHover(context);
     const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

     return (
          <>
               <div ref={refs.setReference} {...getReferenceProps()}>
                    {children}
               </div>
               {isOpen && (
                    <div
                         ref={refs.setFloating}
                         style={{
                              ...floatingStyles,
                              background: 'rgba(0, 0, 0, 0.8)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              zIndex: 1000,
                              pointerEvents: 'none',
                              userSelect: 'none',
                              WebkitUserSelect: 'none',
                              MozUserSelect: 'none',
                              msUserSelect: 'none'
                         }}
                         {...getFloatingProps()}
                    >
                         {content}
                    </div>
               )}
          </>
     );
};

export default Tooltip; 
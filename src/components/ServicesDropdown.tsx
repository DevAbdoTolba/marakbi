"use client";
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// CSS for animations
// Keep translateX(-50%) inside the keyframes so the animation does not
// reset the horizontal centering applied via transform. Both static and
// animated transforms target the SAME property (transform) — never mix
// with Tailwind's translate-x utilities (which in v4 set the separate
// `translate` CSS property and would double the X shift).
const styles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

interface Service {
  id: number;
  name: string;
  image: string;
  description?: string;
}

interface ServicesDropdownProps {
  variant?: 'transparent' | 'solid';
}

const ServicesDropdown = ({ variant = 'transparent' }: ServicesDropdownProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const [panelTop, setPanelTop] = useState<number>(140);

  // Mapping service IDs to category IDs
  // Based on API: 1=Motor Boat, 2=Felucca, 3=Fishing, 4=Occasion, 37=Sharing, 38=Water Activities, 39=Travel
  const serviceToCategoryMap: Record<number, number> = {
    1: 1, // Private Boats / Motor Boats → category_id=1
    2: 37, // Sharing Trips → category_id=37
    3: 39, // Travel Boats → category_id=39
    4: 3, // Fishing Boats → category_id=3
    5: 38, // Water Activities (Kayak) → category_id=38
    6: 4, // Occasion → category_id=4
  };

  const services: Service[] = [
    {
      id: 1,
      name: "Private Boats",
      image: "/images/Frame 1321316435.webp",
      description: "Exclusive private boat rentals"
    },
    {
      id: 2,
      name: "Sharing Trips",
      image: "/images/Frame 1321316436.webp",
      description: "Group boat trips and experiences"
    },
    {
      id: 3,
      name: "Travel Boats",
      image: "/images/Frame 1321316437.webp",
      description: "Long-distance travel boats"
    },
    {
      id: 4,
      name: "Fishing Boats",
      image: "/images/Frame 1321316438.webp",
      description: "Fishing expeditions and trips"
    },
    {
      id: 5,
      name: "Water Activities",
      image: "/images/Frame 1321316439.webp",
      description: "Water sports and activities"
    },
    {
      id: 6,
      name: "Occasion",
      image: "/images/Frame 1321316440.webp",
      description: "Special events and celebrations"
    },
    {
      id: 7,
      name: "Yachts",
      image: "/images/miveme-yacth-9.webp",
      description: "Luxury yacht experiences"
    }
  ];

  // Mark as mounted client-side so we can safely use document.body for the portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Recompute panel top from trigger position whenever the dropdown opens
  // or the viewport resizes. Close the panel on scroll so it doesn't float
  // detached from the navbar after the user scrolls past it.
  useEffect(() => {
    if (!isOpen) return;

    const updateTop = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPanelTop(rect.bottom + 8);
      }
    };

    updateTop();

    const handleScroll = () => setIsOpen(false);

    window.addEventListener('resize', updateTop);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateTop);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  // Click outside (trigger AND portaled panel) to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideTrigger = dropdownRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (!insideTrigger && !insidePanel) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cancelClose = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleTriggerEnter = () => {
    cancelClose();
    // Compute the panel top synchronously BEFORE opening so the first paint
    // mounts the panel in the correct position (no flash from a stale default).
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelTop(rect.bottom + 8);
    }
    setIsOpen(true);
  };

  const textColor = variant === 'solid' ? 'text-gray-900' : 'text-white';
  const hoverColor = variant === 'solid' ? 'hover:text-blue-600' : 'hover:text-orange-300';

  // The portaled panel content. Mouse handlers on the panel itself keep the
  // dropdown open while the user moves between the trigger and the panel.
  const panelContent = isOpen && mounted ? (
    <div
      ref={panelRef}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      className="fixed w-[1280px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]"
      style={{
        top: `${panelTop}px`,
        left: '50%',
        transform: 'translate(-50%, 0)',
        animation: 'slideDown 0.3s ease-out backwards'
      }}
    >
      <div className='p-2'>
        <div className="flex flex-wrap justify-center gap-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="group cursor-pointer hover:scale-103 transition-all duration-200 bg-gray-50 hover:bg-white rounded-lg p-3 hover:shadow-md flex-shrink-0 w-44"
              onClick={() => {
                setIsOpen(false);
                const categoryId = serviceToCategoryMap[service.id];
                if (categoryId !== undefined) {
                  router.push(`/boat-listing?category_id=${categoryId}`);
                } else {
                  router.push('/boat-listing');
                }
              }}
            >
              <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="176px"
                  className="object-cover group-hover:scale-106 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/20 transition-colors duration-200"></div>
              </div>
              <h3 className="text-gray-800 text-base font-semibold font-poppins text-center group-hover:text-blue-600 transition-colors duration-200">
                {service.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <style>{styles}</style>
      <div
        className="relative"
        ref={dropdownRef}
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={scheduleClose}
      >
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          className={`flex items-center gap-1 ${textColor} ${hoverColor} transition-colors`}
        >
          Our Services
          <Image
            src="/icons/arrow_drop_down-1.svg"
            alt="Dropdown arrow"
            width={16}
            height={16}
            className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} filter brightness-0 invert`}
          />
        </button>
      </div>
      {/* Render the dropdown panel into document.body so it escapes the nav's
          stacking context entirely — no z-index can be accidentally trumped by
          a sibling/ancestor inside the header. */}
      {mounted && panelContent && createPortal(panelContent, document.body)}
    </>
  );
};

export default ServicesDropdown;

import React from 'react'

interface SectionProps {
    id: string;
    childClass: React.ReactNode;
    childStyle: React.CSSProperties;
    children: React.ReactNode;
    }

const Section = (
    { id, childClass ,children }: SectionProps
) => {
  return (
    <section
        id={id}
        className={childClass? 'py-20' : 'py-20'}
    >
        {children}
    </section>
  )
}

export default Section

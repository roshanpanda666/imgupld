import Link from 'next/link'
import React from 'react'

const Nav = () => {
  return (
    <div>
      <div className='flex justify-center items-center gap-60 cursor-pointer'>
        <Link href="/"><div className='hover:text-cyan-400'>image section</div></Link>
        <Link href="/textsection"><div className='hover:text-cyan-400'>text section</div></Link>
      </div>
    </div>
  )
}

export default Nav

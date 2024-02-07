import { createPortal } from 'react-dom'

interface Props {
    isOpen: boolean
    children: React.ReactNode
}

const Modal = ({ isOpen, children }: Props) => {
    if (!isOpen) return null

    return createPortal(<div className='absolute top-0 h-full w-full flex items-center justify-center bg-black bg-opacity-15'>
        <div className='bg-white w-1/2 max-h-1/2 my-shadow py-4 px-8 flex flex-col'>
            {children}
        </div>
    </div>, document.body)
}

export default Modal

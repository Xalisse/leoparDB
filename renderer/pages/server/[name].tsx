import { useRouter } from "next/router"
import Modal from "../../components/common/modal"
import { useState } from "react"
import { removeServer } from "../../lib/api/api"
import toast, { Toaster } from "react-hot-toast"

const Server = () => {
    const router = useRouter()
    const { name } = router.query as { name: string }
    const [isOpenModalRemove, setIsOpenModalRemove] = useState(false)

    const removeServerFromList = () => {
        removeServer(name)
        toast.success('Server removed successfully', { position: 'bottom-left' })
        router.push('/')
    }

    return (
        <div>
            <h1>{name}</h1>

            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setIsOpenModalRemove(true)}>Remove server</button>

            <Modal isOpen={isOpenModalRemove}>
                <div>
                    <h1>Remove server</h1>
                    <p>Are you sure you want to remove this server? This action will be permanent.</p>
                    <div className="flex gap-4">
                        <button className="border border-green-400 px-4 py-2 rounded" onClick={() => setIsOpenModalRemove(false)}>Cancel</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={removeServerFromList}>Remove server</button>
                    </div>
                </div>
            </Modal>

            <Toaster />
        </div>
    )
}

export default Server

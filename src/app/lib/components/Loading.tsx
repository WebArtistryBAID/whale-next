import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

export default function Loading() {
    return <div className="w-full h-full flex flex-col justify-center items-center">
        <FontAwesomeIcon aria-label="Loading" icon={faSpinner} className="text-4xl text-gray-400 mb-3"
                         spin={true}/>
    </div>
}

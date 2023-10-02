
import gif from '../assets/3nR6.gif'
import PropTypes from 'prop-types';

const CongratsScreen = ({ sheetLink }) => {
    return (
        <div>
            {sheetLink && (
                <div className="card card-compact h-52 w-[40%] bg-base-100 shadow-xl absolute left-0 right-0 ml-auto mr-auto top-40 ease-in-out">
                    <div className="card-body text-center flex flex-row">
                        <img className='z-10 w-24' src={gif} alt="" />
                        <div className=''>
                            <h1 className='ml-10 text-2xl'>Congratulations🥳🥳🥳</h1>

                            <div className='mt-10  text-lg'>
                                <div><a className='link link-success ' href={sheetLink}>Your Sheet Link</a></div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { window.location.reload() }} className="m-auto btn btn-primary w-40 mb-7">Make a New Sheet</button>
                </div>
            )}
        </div>
    )
}

CongratsScreen.propTypes = {
    sheetLink: PropTypes.string.isRequired,
};

export default CongratsScreen;


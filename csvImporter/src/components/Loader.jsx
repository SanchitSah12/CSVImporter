

import PropTypes from 'prop-types';

function Loader({ isLoading }) {

    // Make the API call and update the state variables

    return (
        <div>
            {isLoading && (
            <div className="card card-compact w-96 bg-base-100 shadow-xl absolute left-0 right-0 ml-auto mr-auto top-60 ease-in-out">
                <div className="card-body text-center">
                    <div className=''>
                        
                            <div><span className="loading loading-dots loading-lg"></span></div>
                        
                    </div>
                </div>
            </div>
            )}
        </div>

    );
}

Loader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
};

export default Loader;

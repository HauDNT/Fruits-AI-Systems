import Image from "next/image";

interface Feedback {
    avatarUrl: string;
    name: string;
    feedback: string;
}

const userFeedbacks: Feedback[] = [
    {
        avatarUrl: '/images/users_feedback/ronaldo.png',
        name: 'Ronaldo',
        feedback: 'I completed the HTML CSS course in 1 month and made a basic website interface. It\'s great!'
    },
    {
        avatarUrl: '/images/users_feedback/messi.png',
        name: 'Messi',
        feedback: 'I completed the HTML CSS course in 1 month and made a basic website interface. It\'s great!'
    },
    {
        avatarUrl: '/images/users_feedback/elon.png',
        name: 'Elon Musk',
        feedback: 'I completed the HTML CSS course in 1 month and made a basic website interface. It\'s great!'
    },
];

const Feedbacks = () => {
    return (
        <div className='mb-32' id={'feedbacks'}>
            <div className={'mx-auto max-w-7xl mb-8'}>
                <div className='col-span-12'>
                    <h3 className='text-center text-3xl md:text-5xl font-bold mb-12 pt-4'>
                        Đánh giá của học viên
                    </h3>
                    <div className={'flex'}>
                        {
                            userFeedbacks.map((feedback, index) => (
                                <div key={index} style={{margin: "0 15px"}}>
                                    <div className='card-feedbacks'>
                                        <Image
                                            className={'card-feedbacks_avatar'}
                                            src={feedback.avatarUrl}
                                            alt={'User avatar'}
                                            width={100}
                                            height={100}
                                            style={{ borderRadius: '100%' }}
                                        />
                                        <h3 className='pt-10 text-2xl text-offwhite font-semibold text-center mt-8'>{feedback.name}</h3>
                                        <p className='text-base font-normal text-bluish text-center mt-2'>{feedback.feedback}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feedbacks
// here the details feilds of that forms in below
// common data 
const commonFields = [
    {
        name: 'email',
        type: 'email',
        placeholder: 'copycodecommunity@gmail.com',
        required: true,
        options: []
    }, {
        name: 'name',
        placeholder: 'copycodecommunity',
        type: 'text',
        required: true,
        options: []
    }, {
        name: 'collegeName',
        placeholder: 'Your College Name Here...',
        type: 'text',
        required: true,
        options: []
    }
]
// regitration form for joining our community
const fields = [
    ...commonFields, {
        name: 'course',
        placeholder: "What's your course?",
        options: [
            'bca', 'btech', 'mca', 'mtech'
        ],
        type: 'radio',
        required: true
    }, {
        name: 'courseYear',
        placeholder: "Which year are you in? (First/Second/Third/Fourth)",
        options: [
            '1 year', '2 year', '3 year', '4 year'
        ],
        type: 'radio',
        required: true
    }, {
        name: 'roles',
        placeholder: "What role do you want to take up?",
        options: [
            'Technical Team', 'Management Team', 'Graphics', 'Content Writer', 'video Editor', 'Social Handler and Photographer'
        ],
        type: 'radio',
        multiple: false,
        displayAs: 'Checkboxes'
        , required: true
    }, {
        name: 'skills',
        placeholder: "Enter your skills separated by commas.",
        type: 'text',
        required: true
    }, {
        name: 'resume',
        placeholder: 'drop your resume link here',
        type: "text"
    }
]

// events  that can be registered for a user.
const eventFields = [
    ...commonFields
]


// different types of here forms 
export const joinCommunityForm = {
    title: "Join Our Community",
    subtitle: `Become a part of the community and start sharing knowledge with others.
    You can also share your projects or any other work you have done so far.`,
    fields: [...fields],
    buttons: [
        {
            text: "Submit"
            , type: 'submit'
        }
    ]
}

export const applyForEvents = {
    title: "Apply For Events",
    subtitle: 'Become a part of the event register here.'
        + 'You will be notified when we are looking for volunteers for our events,'
        + 'and once selected, you will receive instructions on how to sign up.',
    fields: [...eventFields],
    buttons: [{
        text: "Apply Now!"
        , type: 'submit'
    }]
}


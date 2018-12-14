import mockAxios from 'axios';
export default {
   
        ...mockAxios,
        ...{
            create: jest.fn(() => ({
                ...mockAxios,
                interceptors: {
                    request: {
                        use: jest.fn()
                    }
                }
            }))
        }
}
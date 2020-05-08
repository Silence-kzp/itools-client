export const ssr = {
    getInitialData: async function() {
        return {};
    },
    modifyGetInitalPropsParams: async function(memo: any) {
        console.log(memo);
        return {
            ...memo,
        };
    },
}
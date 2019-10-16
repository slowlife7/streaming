module.exports = function(model) {

    const calculatePagination = function( count_items, count_per_page, count_pagination, page_no ) {        
        const count_page_group = Math.ceil(count_items / count_per_page); //페이징으로 보여질 총 페이지 개수
        let last_page_group =Math.ceil(page_no / count_pagination) * count_pagination; //현재 페이징에서 가장 마지막 페이지
        const first_page_group = last_page_group - count_pagination + 1; //현재 페이징에서 가장 첫 페이지
        if (last_page_group > count_page_group) {
            // 가장 마지막페이지가 전체 페이지 개수 보다 큰 경우
            last_page_group = count_page_group;
        }

        let page = {
            count_items : count_items,
            prev: first_page_group - 1 < 0 ? 0 : first_page_group - 1,
            first: first_page_group,
            last: last_page_group,
            cur: page_no > last_page_group ? last_page_group : page_no,
            next: last_page_group < count_page_group ? last_page_group + 1 : 0
        };
        return page;
    };

    return {
        findItems : function(json = {}) {
            return new Promise(function(resolve, reject) {
                let count_items = 0;
                const json_params = {};
                json_params.condition = json.condition || {};
                json_params.sort = json.sort || {};
                json_params.skip = json.skip || 0;
                json_params.limit = json.limit || 10;
                json_params.page_no = json.currentpage || 0;
                json_params.maxpaging = json.maxpaging || 5;
      
                model
                  .countDocuments(json_params.condition)
                  .then(count => {
                    count_items = count;
                    return model
                      .find(json_params.condition, { _id: 0, __v: 0 })
                      .sort(json_params.sort)
                      .skip(json_params.skip)
                      .limit(parseInt(json_params.limit));
                  })
                  .then(result => {
                    const pagination = calculatePagination(count_items,
                                        json_params.limit,
                                        json_params.maxpaging,
                                        json_params.page_no + 1);
                    resolve({ ...pagination, items: result });
                  })
                  .catch(err => {
                    reject(err);
                  });
            });
        }
    }
  };
  
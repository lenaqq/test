/*
 *  NetworkData
 *
 *
 */
class NetworkData
{
    constructor()
    {
        this.id_list = [];
        this.following_list = [];
        this.tag_list = [];
        this.unique_tag_list = [];
        this.tag_count_list = [];
        this.tag_ref_id_list = [];        
    }

    clear()
    {
        this.id_list = [];
        this.following_list = [];  
        this.tag_list = [];
        this.unique_tag_list = [];
        this.tag_count_list = [];
        this.tag_ref_id_list = []; 
    }

    /*
     * Twitter data fetching function from store.sample()
     */
    get_sample_data_following_list() 
    {
        let following_list;

        store.sample(function(sampleData) {
            following_list = sampleData;
        });
        
        return following_list;
    }

    get_tag_list(id_list) 
    {
        let tag_list = [];

        store.tags(
            id_list,
            function(tagData) {
                tag_list = tagData;
            },
            function(error) {
            // No error is gonna happen.
            }
        );

        return tag_list;
    }


    build_tag_list(tag_list)
    {
        this.id_tag_list = tag_list;
        this.unique_tag_list = build_unique_tag_list(this.id_tag_list).sort();

        let tags_count = this.unique_tag_list.length;

        // create twitter.data.tag_count_list with same length as unique_tag_list
        this.tag_count_list = Array(tags_count);
        this.tag_count_list.fill(0);
        this.tag_ref_id_list = Array(tags_count);

        for (i = 0; i < tags_count; i++)
            this.tag_ref_id_list[i] = [];

        //twitter.data.tag_ref_id_list.fill(Array()); does not work

        count_tags(this.id_list, this.id_tag_list, this.unique_tag_list, this.tag_count_list, this.tag_ref_id_list);

        let zip = (a1, a2, a3) => a1.map((x, i) => [x, a2[i], a3[i]]);
        
        // tag_data_set
        return zip(this.unique_tag_list, this.tag_count_list, this.tag_ref_id_list);
    }

    /*
     * find_following_ids_and_tags
     *
     * construct data set: [ [1, [4, 3, 6]], [3, [1, 2]], [5, []]]
     *
     * Use id_list and following list, and id_tag_list (list of tags corresponding to the ids), 
     * fetched by get_tag_list() or store.tags()
     */
    find_following_ids_and_tags()
    {
        let data_set = [];
        let data;

        for (let i = 0; i < this.id_list.length; i++)
        {
            let id = this.id_list[i];
            let id_folowing_list = [];

            for (let rel of this.following_list)
            {
                if (id === rel[0])   // compare 'from id'
                {
                    id_folowing_list.push(rel[1]); // add 'to id'
                }
            }

            data = [ id, id_folowing_list, this.id_tag_list[i] ];
            data_set.push(data);
        }

        return data_set;
    }

    find_most_followed_id(id_data_set)
    {
        let max_followed_count = 0;
        let max_id_follower_pair = [ [], 0];

        for (let id of this.id_list)
        {
            let id_followed_count = 0;

            id_idx = this.id_list.indexOf(id);
          
            let folowing_list = id_data_set[id_idx][1]; // following id list

            for (let following_relation of this.following_list)
            {
                //console.log(following_relation[0] + ', ' + following_relation[1]);
                if (id == following_relation[1])
                {
                    id_followed_count++;
                    //followed_id = following_relation[0];    // can be used to construct another list
                }
            }

            if (id_followed_count > max_followed_count)
            {
                max_followed_count = id_followed_count;
                max_id_follower_pair[0] = [ id ];
                max_id_follower_pair[1] = max_followed_count;
            }
            else
            if (id_followed_count == max_followed_count)  
            {
                max_id_follower_pair[0].push(id);
            }
        }

        return max_id_follower_pair;
    }

    find_most_following_id(id_data_set)
    {
        let max_following_count = 0;
        let max_id_following_pair = [ -1, 0];

        for (let id of this.id_list)
        {
            let id_following_count = 0;

            id_idx = this.id_list.indexOf(id);
          
            let folowing_list = id_data_set[id_idx][1]; // following id list

            for (let following_relation of this.following_list)
            {
                // console.log(following_relation[0] + ', ' + following_relation[1]);
                if (id == following_relation[0])
                {
                    id_following_count++;
                    //followed_id = following_relation[0];    // can be used to construct another list
                }
            }

            if (id_following_count > max_following_count)
            {
                max_following_count = id_following_count;
                max_id_following_pair[0] = [ id ];
                max_id_following_pair[1] = max_following_count;
            }
            else
            if (id_following_count == max_following_count)  
            {
                max_id_following_pair[0].push(id);
            }        
        }

        return max_id_following_pair;
    }    
}

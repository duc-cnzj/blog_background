import axios from '@/libs/api.request'
import Filter from '@/filters/Filter'
import { socialiteEnum, prefix } from '@/filters/socialiteUser'

export const index = (obj) => {
  let queryData = (new Filter(obj, socialiteEnum, prefix)).filterParams()

  return axios.request({
    url: 'admin/socialite_users',
    params: queryData
  })
}

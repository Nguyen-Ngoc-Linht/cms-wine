import cookies from '@/utils/cookies'
import { defineStore } from 'pinia'
import { apiGetRouteUser } from '@/api/expressway'

const useRouteUser = defineStore({
  id: 'route-user',
  state: () => {
    return {
      routes: [],
      stations: [],
      routeStation: [],
    }
  },
  actions: {
    async GET_LIST_ROUTES(uuid, isAdmin) {
      try {
        const params = {
          id: uuid,
        }
        if (!isAdmin) {
          const rs = await apiGetRouteUser(params)
          if (rs.status === 200) {
            this.routeStation = rs.data || []
            for (const route of this.routeStation) {
              this.routes.push(route.routeId)
              // for (const station of route.stations) {
              //   this.stations.push(station)
              // }
            }
          }
        }
      } catch (e) {
        console.log(e)
        return e
      }
    },
    GET_STATIONS(routeId) {
      try {
        const listStation = []
        for (const route of this.routeStation) {
          if (routeId === route.router_id) {
            for (const station of route.stations) {
              listStation.push(station)
            }
          }
        }
        return listStation
      } catch (e) {
        return []
      }
    },
  },
})

export default useRouteUser

import { defineStore } from 'pinia'

export const useLandPlotStore = defineStore('landPlot', {
  state: () => ({
    id: '',
    geometry: '',
  }),
  actions: {
    setPlot(id: string, geometry: string) {
      this.id = id
      this.geometry = geometry
    },
    clearPlot() {
      this.id = ''
      this.geometry = ''
    }
  }
}) 
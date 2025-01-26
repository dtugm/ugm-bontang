<template>
  <DashboardEmployee />
</template>
<script lang="ts" setup>
import petaGarisMock from "~/app/mock/petaGaris.mock";
import petaGarisConstant from "~/app/constant/petaGaris.constant";
const statusGrid: any = petaGarisConstant.statusGrid;
const pembagian = petaGarisMock.pembagianArea;
const headerProgressDoc: any = petaGarisConstant.progressHeader;
const progressDocument = petaGarisMock.progressDocument;
</script>

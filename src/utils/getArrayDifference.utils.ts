const getArrayDifference = (array1: any[], array2: any[]) => {
    return array1.filter(object1 => {
      const aId = object1.id || object1._id;
      return !array2.some(object2 => {
        const bId = object2.id || object2._id;
        return aId === bId;
      });
    });
};

export default getArrayDifference;
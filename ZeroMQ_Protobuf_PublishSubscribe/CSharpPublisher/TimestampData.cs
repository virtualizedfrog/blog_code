using System;
using ProtoBuf;

namespace CSPublish
{
    [ProtoContract]
    class TimestampData
    {
        [ProtoMember(1)]
        public Int64 Timestamp { get; set; }
        [ProtoMember(2)]
        public string Key { get; set; }
        [ProtoMember(3)]
        public double Data { get; set; }
    }
}
